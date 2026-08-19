---
title: LangGraph教程(一)：从零开始构建你的第一个AI聊天机器人
pageId: 264605ee-e889-8089-81f9-d9bc9bb64ee8
description: 本文是 《LangGraph入门全解》系列的第一篇。在这篇文章中，我们将基于LangGraph构建一个聊天机器人。并学习查看Graph的图结构。如果出你是新手，建议先阅读主指南以了解LangGraph的全貌。LangGraph入门, LangGraph教程, LangGraph聊天机器人, StateGraph使用
date: 2025-09-04
updateDate: 2025-09-04
tags: [LangGraph, LLM, AI]
cover: cover/264605ee-e889-8089-81f9-d9bc9bb64ee8_80a0584fd6e256fd14aefae7618f47d9.png
---

本文是 **《LangGraph入门全解》<mention-page url="https://app.notion.com/p/264605eee889806eb847ce4e7bcba614"/> **系列的第一篇。在这篇文章中，我们将构建一个聊天机器人。如果出你是新手，建议先阅读主指南以了解LangGraph的全貌。

# 基于LangGraph开发一个聊天bot

## bot Agent 代码

```python
from typing import Annotated
from typing_extensions import TypedDict
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from pydantic import SecretStr

# 此处定义你自己的模型
llm = ChatOpenAI(base_url="http://127.0.0.1:8000/v1", api_key=SecretStr("123123"), model="qwen3_32")

# 定义图状态
class State(TypedDict):
    messages: Annotated[list, add_messages]  # 此处维护完整的消息历史

graph = StateGraph(State)


def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}

graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

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

## 查看bot图结构

使用下面的代码，保存图结构，此代码会反复用到

```python
from PIL import Image
import io
png_data = app.get_graph(xray=True).draw_mermaid_png()
img_io = io.BytesIO(png_data)

# 使用PIL的Image打开BytesIO对象
image = Image.open(img_io)

# 指定保存的本地文件路径
save_path = 'local_image.png'

# 保存图像到本地
image.save(save_path)

```

![image.png](images/264605ee-e889-8089-81f9-d9bc9bb64ee8/264605ee-e889-8089-81f9-d9bc9bb64ee8_f7156c639e27a15f0c960e7d21620dde.png)

## 运行示例

![output.gif](images/264605ee-e889-8089-81f9-d9bc9bb64ee8/264605ee-e889-8089-81f9-d9bc9bb64ee8_09024bb7b9c6e3468f278ed482a70f7e.gif)
