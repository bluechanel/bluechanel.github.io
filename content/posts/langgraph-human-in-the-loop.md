---
title: LangGraph教程(四)：实现人机协同（Human-in-the-loop）的关键技巧
pageId: 264605ee-e889-80f8-a8ce-e89efa0548c5
description: 本文是 《LangGraph入门全解》系列的第四篇。在这篇文章中，我们暂时移除了搜索能力，为chat bot增加向用户求助的能力，也就是人机协同，这在实际开发中非常的有用。LangGraph人机交互, Human-in-the-loop, LangGraph interrupt, AI人工干预
date: 2025-09-04
updateDate: 2025-09-04
tags: [LLM, Prompt, LangChain, LangGraph, AI]
cover: cover/264605ee-e889-80f8-a8ce-e89efa0548c5_318cebbc702cfea8961ec65dbff40aa6.png
---

本文是 **《LangGraph入门全解》<mention-page url="https://app.notion.com/p/264605eee889806eb847ce4e7bcba614"/> **系列的第四篇。在这篇文章中，我们暂时移除了搜索能力，为chat bot增加向用户求助的能力，也就是人机协同，这在实际开发中非常的有用。如果出你是新手，建议先阅读主指南以了解LangGraph的全貌。

# 在LangGraph中实现人机交互

在前几篇文章中，我们介绍了 LangGraph 实现多轮对话、工具调用和记忆。但在实际应用场景里，完全让Agent自主做决策并不总是最优解。**有些环节需要人进行确认或干预**，例如：

- 财务或法律类应用中，模型生成的建议必须经过人工确认。

- 医疗类应用中，AI 可以给出初步诊断，但医生才是最终的决策者。

- 多工具协作时，AI 可能不确定该选用哪个工具，需要人类来决定。

这就是 **Human-in-the-loop (HITL)** 的价值所在：在关键节点引入人工确认，保证智能应用既高效又可靠。

## 什么是 Human-in-the-loop？

HITL 就是**人在某些环节作为节点参与决策**。在 LangGraph 中，它通常通过以下方式实现：

1. **工具节点（Tool Node）**：定义一个人类工具，模型可以调用该“人类工具”，把问题交给用户确认。

2. **中断/等待机制**：LangGraph 会暂停执行，直到人类提供反馈，用到了上一节的任务记忆。

3. **继续执行**：人类确认或修正后，流程继续。

这样做的好处是：

- 模型结果更可控

- 在多工具协同时减少错误调用

- 提升系统的安全性和可解释性

## 在 LangGraph 中实现 HITL

只需要定义一个人机交互工具即可。

```python
from langgraph.types import interrupt
from langchain_core.tools import tool
@tool
def human_assistance(query: str) -> str:
"""请求人类帮助，模型在不确定时会调用此工具"""human_response = interrupt({"query": query})
    return human_response["data"]

tools = [human_assistance]
llm_with_tools = llm.bind_tools(tools)
```

### 完整代码如下

我们移除之前聊天机器人的搜索工具，当我们询问实时信息时，模型就会调用人机交互工具。

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from langgraph.types import Command, interrupt
from langchain_core.tools import tool
from langgraph.checkpoint.memory import InMemorySaver
memory = InMemorySaver()
# 此处定义你自己的模型
llm = ChatOpenAI(model="qwen3_32")

# 定义人机交互工具
@tool
def human_assistance(query: str) -> str:
"""请求人类帮助，模型在不确定时会调用此工具"""human_response = interrupt({"query": query})
    return human_response["data"]

tools = [human_assistance]
llm_with_tools = llm.bind_tools(tools)

# 定义图状态
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史

graph = StateGraph(State)

def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
tool_node = ToolNode(tools=tools)

graph.add_node("chatbot", chatbot)
graph.add_node("tools", tool_node)
graph.add_conditional_edges(
    "chatbot",
    tools_condition,
)
graph.add_edge("tools", "chatbot")
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

app = graph.compile(checkpointer=memory)

if __name__ == "__main__":
    thread_id = "multi_tool_hitl_demo"
    pending_interrupt = False
    # 修改此处对话代码，区分普通对话和模型请求人类帮助
    while True:
        if not pending_interrupt:
            user_input = input("👨💻: ")
            if user_input.lower() in ["quit", "exit", "q"]:
                print("Exiting...")
                break
            response = app.invoke(
                {"messages": {"role": "user", "content": user_input}},
                config={"configurable": {"thread_id": thread_id}},
            )
        else:
            # 人类输入，恢复中断
            human_input = input("👨💻(人工介入): ")
            human_command = Command(resume={"data": human_input})
            response = app.invoke(
                human_command,
                config={"configurable": {"thread_id": thread_id}},
            )

        # 判断中断还是正常输出
        if "__interrupt__" in response:
            pending_interrupt = True
            query = response["__interrupt__"][0].value["query"]
            print(f"🤖 <human_assistance> 请求人工帮助: {query}")
        else:
            pending_interrupt = False
            print(f'🤖: {response["messages"][-1].content}')
```

### 效果如下

![c0bceacf-caa2-4399-b83b-04cf27fe864c.png](images/264605ee-e889-80f8-a8ce-e89efa0548c5/264605ee-e889-80f8-a8ce-e89efa0548c5_9b8d38e4e30f5cd5ad8de7b63cd8cd24.png)

在这个例子里：

1. 模型发现用户问题涉及实时信息。

2. 它没有搜索工具无法提供实时信息，所以调用 `human_assistance`请求提供更多信息。

3. 用户输入实时信息后，Agent继续执行。

这样，我们就实现了一个**Human-in-the-loop**的流程。
