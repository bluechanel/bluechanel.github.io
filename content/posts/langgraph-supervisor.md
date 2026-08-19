---
title: LangGraph进阶：构建多智能体协作系统（Supervisor架构与子图实战）
pageId: 264605ee-e889-806a-93a7-e8acc33707b6
description: 本文是 《LangGraph入门全解》系列的第五篇。多智能体协作是现在一个非常热门的研究领域，对于复杂问题，将问题拆解，然后使用领域Agent，能够以更高的效率和质量完成复杂任务。LangGraph多智能体, LangGraph子图, Multi-Agent, Supervisor架构
date: 2025-09-04
updateDate: 2025-09-04
tags: [LLM, Prompt, LangChain, LangGraph, AI]
cover: cover/264605ee-e889-806a-93a7-e8acc33707b6_b2c2ce517acc544ba861092cc222af33.png
---

本文是 **《LangGraph入门全解》<mention-page url="https://app.notion.com/p/264605eee889806eb847ce4e7bcba614"/> **系列的第五篇。多智能体协作是现在一个非常热门的研究领域，对于复杂问题，将问题拆解，然后使用领域Agent，能够以更高的效率和质量完成复杂任务。如果出你是新手，建议先阅读主指南以了解LangGraph的全貌。

# 多智能体与LangGraph子图

在构建智能体系统中，我们常常会遇到下面几个问题：

- 工具数量过多，代理在决定调用哪个工具时容易出错；

- 上下文越来越复杂，单个代理难以追踪和管理；

- 任务需要涉及多个专业领域（如规划师、研究人员、数学专家等），单一Prompt难以编写。

这些问题就像现实社会一样：不同职业的人分工明确，效率和准确率才能提升。对于智能体（Agent）系统来说，同样需要合理分工与协作。

## LangGrpah子图实战

在 LangGraph 中，我们可以通过 **子图（Subgraph）** 来解决复杂任务的拆解与分工。这样做有几个好处：

1. **复杂任务拆解：**单个代理专注于一部分工作，使系统更易于开发、测试和维护。

2. **专业化：**每个 Agent 聚焦于某一领域（搜索、分析、决策、执行）。

3. **并行与效率：**多个智能体可并行处理任务，显著缩短完成时间。

在 LangGraph 中，子图的定义方式主要有两种：

- **共享状态：**子图和父图使用同一个状态图，适用于小型 Agent。

- **不共享状态：**子图维护自己的状态图，分工更明确，适用于较复杂的系统。

### 子图与父图共享状态示例

新建一个总结历史聊天记录的子图，并作为父图的一个节点

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.constants import END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import InMemorySaver

# 此处定义你自己的模型
llm = ChatOpenAI(model="qwen3_32")
memory = InMemorySaver()
# 定义图状态
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史
    mem0_user_id: str
    preference: str
# 子图， 使用与父图同样的状态
child_graph = StateGraph(State)
def summarize_memory(state: State):
"""总结过往的历史聊天"""summary_prompt = [
        {
            "role": "system",
            "content": "你是一个总结助手，请用简明扼要的语言总结对话历史。",
        },
        {"role": "user", "content": str(state["messages"])},
    ]
    result = llm.invoke(summary_prompt)
    return {"preference": result.content}
child_graph.add_node("summarize", summarize_memory)
child_graph.add_edge("summarize", END)
child_graph.add_edge(START, "summarize")
child_graph_compile = child_graph.compile()

# 父图
parent_graph = StateGraph(State)
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}
parent_graph.add_node("chatbot", chatbot)
# 添加子图节点
parent_graph.add_node("child_graph", child_graph_compile)
parent_graph.add_edge("chatbot", "child_graph")
parent_graph.add_edge("child_graph", END)
parent_graph.add_edge(START, "chatbot")
app = parent_graph.compile(checkpointer=memory)

if __name__ == "__main__":
    while True:
        user_input = input("👨💻: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Exiting...")
            break
        response = app.invoke(
            {"messages": {"role": "user", "content": user_input}},
            config={"configurable": {"thread_id": "1"}},
        )
        messages = response["messages"]
        print(f'🤖: {response["messages"][-1].content}')
        print("--" * 10)
        print(f'🔅历史聊天记录总结: {response["preference"]}')
```

### 子图与父图不共享状态示例

如果子图和父图状态不共享，可以定义子图自己的状态，并通过调用与父图交互

```python
# 省略重复代码
class ChildState(TypedDict):
    messages: Annotated[list, add_messages]
    preference: str

# 子图，使用子图自定义的状态
child_graph = StateGraph(ChildState)
def summarize_memory(state: State):
"""总结过往的历史聊天"""summary_prompt = [
        {
            "role": "system",
            "content": "你是一个总结助手，请用简明扼要的语言总结对话历史。",
        },
        {"role": "user", "content": str(state["messages"])},
    ]
    result = llm.invoke(summary_prompt)
    return {"preference": result.content}
child_graph.add_node("summarize", summarize_memory)
child_graph.add_edge("summarize", END)
child_graph.add_edge(START, "summarize")
child_graph_compile = child_graph.compile()

# 父图
parent_graph = StateGraph(State)
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

# 编写子图调用函数
def call_subgraph(state: State):
    response = child_graph_compile.invoke({"messages": state["messages"]})
    return {"preference": response["preference"]}

parent_graph.add_node("chatbot", chatbot)
# 添加子图节点
parent_graph.add_node("child_graph", call_subgraph)
parent_graph.add_edge("chatbot", "child_graph")
parent_graph.add_edge("child_graph", END)
parent_graph.add_edge(START, "chatbot")
app = parent_graph.compile(checkpointer=memory)
# 省略 运行代码
```

### 运行效果如下

![330de738-60ea-46da-a655-61002bb9e590.png](images/264605ee-e889-806a-93a7-e8acc33707b6/264605ee-e889-806a-93a7-e8acc33707b6_71ba815700b57c8f5243584bfdf179ac.png)

## LangGraph多智能体协作

### 常见多智能体架构

除了子图机制，LangGraph 还支持多智能体（Multi-Agent）架构。常见的多智能体协作模式主要有以下 5 种：

![19101beb-39c7-444d-82f8-f05dea25a09b.png](images/264605ee-e889-806a-93a7-e8acc33707b6/264605ee-e889-806a-93a7-e8acc33707b6_42f354be856b5206e49187938d968dee.png)

- **网络型：**所有代理彼此通信，任何代理都能决定下一个要调用的代理。

- **主管型：**所有代理与一个主管代理通信，由主管代理决定调用顺序。

- **主管 + 工具调用型：**主管代理将其他代理视为工具，通过 LLM 工具调用来协调工作。

- **分层型：**在主管型基础上进一步抽象，形成多层主管结构，适用于更复杂的任务。

- **自定义工作流型**：每个代理只与部分代理通信，部分任务流是确定性的，部分则由代理自主决定。

### 多智能体主管架构实战

在实际应用中，**主管架构**是最常见的一种多智能体协作方式。下面我们通过一个 **“预订机票、酒店”** 的例子，展示如何实现主管架构。

![d39a0183-cf0d-40e1-bcf8-1fee5296d2fa.png](images/264605ee-e889-806a-93a7-e8acc33707b6/264605ee-e889-806a-93a7-e8acc33707b6_5a39071cdcf5c31ca64d6c1161bca185.png)

示例代码

```python
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import InMemorySaver
from langgraph.prebuilt import create_react_agent
from langgraph_supervisor import create_supervisor
# 此处定义你自己的模型
llm = ChatOpenAI(model="qwen3_32")
memory = InMemorySaver()
def book_hotel(hotel_name: str):
"""Book a hotel"""return f"已成功预订住宿 {hotel_name}."

def book_flight(from_airport: str, to_airport: str):
"""Book a flight"""return f"成功预订了航班从{from_airport}到{to_airport}."
flight_assistant = create_react_agent(
    model=llm,
    tools=[book_flight],
    prompt="你是航班预订助理",
    name="flight_assistant"
)
hotel_assistant = create_react_agent(
    model=llm,
    tools=[book_hotel],
    prompt="你是酒店预订助理",
    name="hotel_assistant"
)
app = create_supervisor(
    agents=[flight_assistant, hotel_assistant],
    model=llm,
    prompt="你管理一个酒店预订助理和一个航班预订助理。将工作分配给他们，完成用户给出的任务，不要询问更多信息。"
).compile()

if __name__ == "__main__":
    while True:
        user_input = input("👨💻: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Exiting...")
            break
        response = app.invoke(
            {"messages": {"role": "user", "content": user_input}},
            config={"configurable": {"thread_id": "1"}},
        )
        for m in response["messages"]:
            print(m.pretty_print())
```

效果如下

![8f93f182-6f2a-48ea-94c4-d9cbef6a9017.png](images/264605ee-e889-806a-93a7-e8acc33707b6/264605ee-e889-806a-93a7-e8acc33707b6_ec87c675ad8a37c745efb3efe21e385e.png)
