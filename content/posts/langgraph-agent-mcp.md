---
title: LangGraph教程(二)：掌握Agent核心能力-工具调用（自定义、预构建与MCP）
pageId: 264605ee-e889-80b3-a6c6-e66d154e6f95
description: 本文是 《LangGraph入门全解》系列的第二篇。在这篇文章中，我们为聊天机器人增加搜索工具，分别展示使用langchain的自定义工具和构建MCP Server方式。LangGraph调用工具, LangGraph ToolNode, LangGraph自定义工具, LangGraph MCP
date: 2025-09-04
updateDate: 2026-08-19
tags: [LangGraph, AI, LLM, MCP]
cover: cover/264605ee-e889-80b3-a6c6-e66d154e6f95_c743460aebf1b29f2acc55931bc0f003.png
---

本文是 **《LangGraph入门全解》<mention-page url="https://app.notion.com/p/264605eee889806eb847ce4e7bcba614"/> **系列的第二篇。在这篇文章中，我们为聊天机器人增加搜索工具，分别展示使用langchain的自定义工具和构建MCP Server方式。如果出你是新手，建议先阅读主指南以了解LangGraph的全貌。

# 在LangGraph中调用工具

LLM 在处理**实时性问题**、**数学计算**等方面往往表现不佳。为了弥补这些不足，一个合格的 Agent 应当具备**调用外部工具的能力**。

本文将从最常见的 **Web 搜索工具** 入手，带你快速上手 LangGraph 的工具调用。这里我们使用 [TavilySearch](https://app.tavily.com/)(https://app.tavily.com) 作为示例（新用户有 1000 次免费搜索额度）。

在一构建聊天机器人的基础上，只需**少量新增代码**，即可完成工具调用。LangGraph 已经帮我们封装了大部分复杂逻辑。

### 示例代码

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from pydantic import SecretStr
from langchain_tavily import TavilySearch
from langgraph.prebuilt import ToolNode, tools_condition

# 此处定义你自己的模型
llm = ChatOpenAI(base_url="http://127.0.0.1:8000/v1", api_key=SecretStr("123123"), model="qwen3_32")

# 定义工具
tool = TavilySearch(tavily_api_key="你的tavily apikey", max_results=2)
tools = [tool]
# 工具绑定到模型
llm_with_tools = llm.bind_tools(tools)

# 定义图状态
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史

graph = StateGraph(State)

def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}
# 使用LangGraph提供的工具节点
tool_node = ToolNode(tools=tools)

graph.add_node("chatbot", chatbot)
# 添加工具节点
graph.add_node("tools", tool_node)
# 添加工具 条件分支
graph.add_conditional_edges(
    "chatbot",
    tools_condition,
)
graph.add_edge("tools", "chatbot")
graph.add_edge(START, "chatbot")

app = graph.compile()

if __name__ == "__main__":
    messages = []
    while True:
        user_input = input("👨💻: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Exiting...")
            break
        messages.append({"role": "user", "content": user_input})
        response = app.invoke({"messages": messages})
        messages = response["messages"]
        print(f'🤖: {response["messages"][-1].content}')
```

### 效果如下

![7ccf1108-a281-4503-b780-ed73fbdbf17c.png](images/264605ee-e889-80b3-a6c6-e66d154e6f95/264605ee-e889-80b3-a6c6-e66d154e6f95_5ce289cb86ce538dd3fd7b2b51961f16.png)

## LangGraph自定义工具与工具节点

LangChain为我们预构建了很多工具，常用的有

- **搜索类**: Bing, SerpAPI, Tavily

- **代码执行类**: Python REPL, Node.js REPL

- **数据库类**: SQL, MongoDB, Redis

- **Web 数据类**: Scraping and browsing

- **其他 API**: OpenWeatherMap, NewsAPI 等

不过，在**真实的企业开发场景**中，更常见的做法是开发 **自定义工具**，以满足个性化需求。

下面演示一个基于 `BaseTool` 的自定义 Tavily 搜索工具，以及如何在 LangGraph 中接入。

### 示例代码

```python
import json
from langchain_core.messages import ToolMessage
from langgraph.constants import END
from typing import Annotated, Type, Optional
from langchain_core.callbacks import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun

from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from pydantic import SecretStr, BaseModel, Field
from langchain_core.tools import BaseTool
from tavily import TavilyClient, AsyncTavilyClient

# 自定义工具部分
class TavilySearchInput(BaseModel):
    query: str = Field(description=("搜索查询"))

class TavilySearchTool(BaseTool):
    name: str = "tavily_search"
    description: str = """一个针对全面、准确和可信的结果进行了优化的搜索引擎。
当需要回答有关时事的问题时很有用。
输入应该是搜索查询。"""
    args_schema: Type[BaseModel] = TavilySearchInput
    # return_direct: bool = True

    def _run(
        self, query: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> int:
        client = TavilyClient()
        search_r = client.search(query=query, max_results=2)
        return search_r

    async def _arun(
        self,
        query: str,
        run_manager: Optional[AsyncCallbackManagerForToolRun] = None,
    ) -> int:
        client = AsyncTavilyClient()
        search_r = await client.search(query=query, max_results=2)
        return search_r

# 自定义的工具执行节点
class ToolNode:
    def __init__(self, tools: list) -> None:
        self.tools_by_name = {tool.name: tool for tool in tools}

    def __call__(self, inputs: dict):
        if messages := inputs.get("messages", []):
            message = messages[-1]
        else:
            raise ValueError("No message found in input")
        outputs = []
        for tool_call in message.tool_calls:
            print(f'正在执行工具 {tool_call["name"]}，参数 {tool_call["args"]}')
            tool_result = self.tools_by_name[tool_call["name"]].invoke(
                tool_call["args"]
            )
            print(f'工具{tool_call["name"]}, 执行结果{json.dumps(tool_result, ensure_ascii=False)}')
            outputs.append(
                ToolMessage(
                    content=json.dumps(tool_result, ensure_ascii=False),
                    name=tool_call["name"],
                    tool_call_id=tool_call["id"],
                )
            )
        return {"messages": outputs}

# 此处定义你自己的模型
llm = ChatOpenAI(base_url="http://127.0.0.1:8000/v1", api_key=SecretStr("123123"), model="qwen3_32")
# 定义工具
tool = TavilySearchTool()
tools = [tool]
# 工具绑定到模型
llm_with_tools = llm.bind_tools(tools)
# 定义图状态
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史
graph = StateGraph(State)
def chatbot(state: State):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

# 工具路由
def route_tools(state: State):
    if isinstance(state, list):
        ai_message = state[-1]
    elif messages := state.get("messages", []):
        ai_message = messages[-1]
    else:
        raise ValueError(f"No messages found in input state to tool_edge: {state}")
    if hasattr(ai_message, "tool_calls") and len(ai_message.tool_calls) > 0:
        return "tools"
    return END

# 使用LangGraph提供的工具节点
tool_node = ToolNode(tools=tools)
graph.add_node("chatbot", chatbot)
# 添加工具节点
graph.add_node("tools", tool_node)
# 添加工具条件边
graph.add_conditional_edges(
    "chatbot",
    route_tools,
    {"tools": "tools", END: END},
)
graph.add_edge("tools", "chatbot")
graph.add_edge(START, "chatbot")
app = graph.compile()

if __name__ == "__main__":
    messages = []
    while True:
        user_input = input("👨💻: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Exiting...")
            break
        messages.append({"role": "user", "content": user_input})
        response = app.invoke({"messages": messages})
        messages = response["messages"]
        print(f'🤖: {response["messages"][-1].content}')
```

### **效果如下**

我们在工具执行节点，打印工具的执行信息

![0829cf43-9a82-4f65-bcfc-d9986539fbc2.png](images/264605ee-e889-80b3-a6c6-e66d154e6f95/264605ee-e889-80b3-a6c6-e66d154e6f95_f55ae8872878bafdd8afafc0f3d1bcf4.png)

除了继承 `BaseTool` 的方式，LangChain 还支持通过 **`@tool`**** 装饰器** 来快速定义工具。相比之下，这种方法更简洁，适合轻量级工具

```python
from typing import Annotated
from tavily import TavilyClient
from langchain_core.tools import tool


@tool("tavily_search")
def tavily_search_tool(query: Annotated[str, "搜索查询"]):
"""一个针对全面、准确和可信的结果进行了优化的搜索引擎。当需要回答有关时事的问题时很有用。输入应该是搜索查询。"""client = TavilyClient()
    search_r = client.search(query=query)
    return search_r

tavily_search_tool.invoke({"query": "北京2025年8月27日天气怎么样？"})
```

## LangGraph调用MCP

除了自定义工具之外，LangGraph 还支持 **MCP（Model Context Protocol）**，这使得工具的复用和扩展性更强。

要在 LangGraph 中使用 MCP，需要额外安装依赖包：

```plain text
pip install langchain-mcp-adapters
```

### 编写一个简单的MCP Server

关于MCP Server编写，参考之前的文章<mention-page url="https://app.notion.com/p/222605eee8898098b91ef684acac99d2"/>

依旧是以Tavily搜索为例

```python
import json
from mcp.server.fastmcp import FastMCP
from tavily import TavilyClient
mcp = FastMCP("search")

@mcp.tool()
async def tavily_search(query: str) -> str:
"""一个针对全面、准确和可信的结果进行了优化的搜索引擎。当需要回答有关时事的问题时很有用。输入应该是搜索查询。"""client = TavilyClient()
    search_r = client.search(query=query, max_results=2)
    return json.dumps(search_r, ensure_ascii=False)

if __name__ == "__main__":
    mcp.run(transport="streamable-http")
```

### **LangGrpah+MCP完整示例代码**

```python
import asyncio
from langchain_mcp_adapters.client import MultiServerMCPClient
from langgraph.prebuilt import ToolNode, tools_condition
from typing import Annotated
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START
from langgraph.graph.message import add_messages
from pydantic import SecretStr

# 此处定义你自己的模型
llm = ChatOpenAI(base_url="http://127.0.0.1:8000/v1", api_key=SecretStr("123123"), model="qwen3_32")
# 配置MCP Server
client = MultiServerMCPClient(
    {
        "search": {
            "url": "http://localhost:8000/mcp/",
            "transport": "streamable_http",
        }
    }
)

class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史
graph = StateGraph(State)

async def main():
    tools = await client.get_tools()
    # 工具绑定到模型
    llm_with_tools = llm.bind_tools(tools)
    def chatbot(state: State):
        return {"messages": [llm_with_tools.invoke(state["messages"])]}
    graph = StateGraph(State)
    graph.add_node(chatbot)
    graph.add_node(ToolNode(tools))
    graph.add_edge(START, "chatbot")
    graph.add_conditional_edges(
        "chatbot",
        tools_condition,
    )
    graph.add_edge("tools", "chatbot")
    app = graph.compile()
    messages = []
    while True:
        user_input = input("👨💻: ")
        if user_input.lower() in ["quit", "exit", "q"]:
            print("Exiting...")
            break
        messages.append({"role": "user", "content": user_input})
        response = await app.ainvoke({"messages": messages})
        messages = response["messages"]
        print(f'🤖: {response["messages"][-1].content}')

asyncio.run(main())
```

### 效果如下

![36eb07df-cfd9-4ada-8218-995c44fff6ba.png](images/264605ee-e889-80b3-a6c6-e66d154e6f95/264605ee-e889-80b3-a6c6-e66d154e6f95_a6337004c4014de551009b267a4508bd.png)

带工具调用的bot graph图如下

![300bd9ae-cbc4-4ecd-b272-59a60841c844.png](images/264605ee-e889-80b3-a6c6-e66d154e6f95/264605ee-e889-80b3-a6c6-e66d154e6f95_e81e77e86aa7e9b52cf55f4150c1a2bc.png)
