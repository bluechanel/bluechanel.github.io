---
title: 🎚️ LangGraph实战 子图、流响应
description: 记录Langgraph使用过程中遇到的问题以及解决方法
date: 2024-09-11
tags: ["LangGraph"]
cover:
    image: images/1738c66d-44b6-45a1-bfeb-f50062d3efec_9d66b50af6cba34e5b96c55454c6012b.png
ShowToc: true
---

## 子图S**ubGraph**


在面对复杂的workflow时，将不同的功能切分为多个子图，可以显著的提升开发难度


![local_imager_example.png](images/1738c66d-44b6-45a1-bfeb-f50062d3efec_c027ef1255359cc82b1711f78c2395c6.png)


上图示例代码


```python
# Sub graph
class AState(TypedDict):
    standalone_question: str
    answer: str


class AGraph(BaseModel):
    model: BaseChatModel

    async def a_chat(self, state: AState) -> dict:
        """
        A Workflow
        :param state:
        :return:
        """
        question = state["standalone_question"]
        return {"answer": question}

    async def workflow(self, *args: list, **kwargs: dict) -> CompiledGraph:
        workflow = StateGraph(MasterState)

        workflow.add_node("a_chat", self.a_chat)

        workflow.set_entry_point("a_chat")
        workflow.add_edge("a_chat", END)

        return workflow.compile()

# Sub graph
class BState(TypedDict):
    standalone_question: str
    answer: str


class BGraph(BaseModel):
    model: BaseChatModel

    async def b_chat(self, state: AState) -> dict:
        """
        A Workflow
        :param state:
        :return:
        """
        question = state["standalone_question"]
        return {"answer": question}

    async def workflow(self, *args: list, **kwargs: dict) -> CompiledGraph:
        workflow = StateGraph(MasterState)

        workflow.add_node("b_chat", self.b_chat)

        workflow.set_entry_point("b_chat")
        workflow.add_edge("b_chat", END)

        return workflow.compile()

# Master graph
class MasterState(TypedDict):
    question: str
    standalone_question: str
    chat_history: List[AnyMessage]
    answer: str


class MasterGraph(BaseModel):
    model: BaseChatModel

    async def re_write(self, state: MasterState) -> dict:
        """
        问题 重写
        """
        if not state["chat_history"]:
            return {"standalone_question": state["question"]}
        _template = """Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

        Chat History:
        {chat_history}
        Follow Up Input: {question}
        Standalone question:
        """
        rewrite_prompt = ChatPromptTemplate.from_template(_template)
        rewrite = rewrite_prompt | self.model
        response = await rewrite.ainvoke(
            {
                "chat_history": state["chat_history"],
                "question": state["question"],
            }
        )
        return {"standalone_question": response.content}

    async def route(self, state: MasterState) -> Literal["a", "b"]:
        """
        模拟问题 路由
        :param state:
        :return:
        """
        question = state["standalone_question"]
        return "a"

    async def workflow(self, *args: list, **kwargs: dict) -> CompiledGraph:
        workflow = StateGraph(MasterState)

        workflow.add_node("re_write", self.re_write)
        workflow.add_node("a", await AGraph(model=self.model).workflow())
        workflow.add_node("b", await BGraph(model=self.model).workflow())

        workflow.set_entry_point("re_write")

        workflow.add_conditional_edges("re_write", self.route, {
            "a": "a",
            "b": "b"
        })

        workflow.add_edge("a", END)
        workflow.add_edge("b", END)

        return workflow.compile()
```


子图直接继承父图的State，所以子图可以方便的**获取**和**重写**父图的State，同时可以有自己的State


## 使用`astream_events`流式输出


需要改造的地方有两个

1. 需要流式输出的节点，添加自定义`tags`使用`astream`，并拼接answer

    ```python
    async def generate(self, state: State) -> dict:
        rag_chain = rag_prompt | self.model.with_config({"tags": ["answer"]})
        context = "\n".join([doc.page_content for doc in state["docs"]])
        answers = []
        async for chunk in rag_chain.astream({"context": context, "question": state["standalone_question"]}):
            answers.append(chunk.content)
        return {"answer": "".join(answers)}
    ```

2. 最终调用的方式，使用`astream_events`，过滤返回的`event`中的`tags`属性，以上面的节点为例

    ```python
    agent = MasterGraph(model=TaliLLM())
    async for event in agent.workflow().astream_events({"question": message, "chat_history": history}, version="v1"):
        kind = event["event"]
        if kind == "on_chat_model_stream" and "answer" in event["tags"]:
            answer += event["data"]["chunk"].content
            print(answer)
    ```

