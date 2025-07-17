---
title: 🤖 AI开发基础资料和相关技术介绍
description: 这篇文章介绍了关于AI开发的基础资料，包括开发工具LangChain和LlamaIndex，以及LangGraph框架。还讨论了LLMs微调的挑战和提示工程技术的应用。此外，还介绍了RAG（增强检索）的基本原理和优化方法，以及向量数据库和Agent的相关内容。
date: 2023-08-09
updateDate: 2025-06-11
tags: ["LLM","RAG","Prompt"]
cover:
    image: images/e6d87ac6-dd5b-48b1-8e18-93f7435fdb4a_c3f4caa2f32e244e8297d9690a0e536d.png
ShowToc: true
---

# 模型选择


[link_to_page](https://wileyzhang.com/posts/4ab81ed7-7622-4ef1-9fc6-1e1ae4edbd99)


# 模型部署


[link_to_page](https://wileyzhang.com/posts/6e4516ff-0701-4009-9841-b0f023ca43a6)


[link_to_page](https://wileyzhang.com/posts/c8a30e22-25df-414c-aa1d-2582622256e5)


# RAG


[link_to_page](https://wileyzhang.com/posts/12e605ee-e889-8093-a063-e0a44f365f2c)


[link_to_page](https://wileyzhang.com/posts/34871ffa-62bc-4995-af00-6faaca757ac8)


# 开发工具


目前主流的开发的工具主要是LangChain和LlamaIndex，个人认为LlamaIndex更偏向研究一些，LangChain偏向工程，所以我们的主要开发工具也是LangChain。


### **LangChain**


[bookmark](https://python.langchain.com/docs/get_started/introduction)


从langchain种获取流式数据


```shell
chain = prompt|llm|StrOutputParser()
async for chunk in chain.astream({"question": "What are the types of agent memory?"}):
	print(chunk, flush=True)
```


如果我们的chain中有本地检索，在流式输出的时候，同时也想把检索到的文档信息返回


```shell
async for chunk in app1.astream_events({"question": "What are the types of agent memory?"},
                                       version="v2"):
    # 文档
    if chunk["event"] == "on_retriever_end":
        print(chunk["data"]["output"])
	      # 这里输出的是一个Document列表，从其中的MetaData中解析出来文档信息即可
        
    # 流式回答
    if chunk["event"] == "on_chat_model_stream":
        s += chunk["data"]["chunk"].content
        print(s)
        # 输出答案
```


### LangGraph


[bookmark](https://langchain-ai.github.io/langgraph/tutorials/)


**简介**


LangGraph 是一个用于构建Agent的框架，它将Agent构建为图（graph）的形式。旨在简化构建复杂、有状态的代理的过程，而无需手动管理状态和中断。LangGraph 使得使用工具响应问题、在需要时与人类连接、以及能够无限期暂停流程并在人类响应后恢复变得容易。


**更多使用**


[LangGraph实战 子图、流响应](https://www.notion.so/1738c66d44b645a1bfebf50062d3efec) 


[link_to_page](https://wileyzhang.com/posts/c8a30e22-25df-414c-aa1d-2582622256e5)


# Prompt


直接针对特定任务对 LLMs 进行微调往往不切实际，或由于效率低下而无法为大多数用户和开发人员实现，研究界已将注意力转向提示的优化。**提示工程**技术是指通过人工或自动化手段，用自然语言编写精确的、针对特定任务的指令，并精心挑选有代表性的示例纳入提示，这已成为 LLMs 的核心研究领域。


[link_to_page](https://wileyzhang.com/posts/ad71285d-325f-42ad-a6f9-28e6cf90571c)


# RAG


RAG包含三个步骤：

- **检索**：根据用户的查询内容，从外部知识库获取相关信息。一般使用到向量数据库。
- **增强**：将用户的查询内容和检索到的相关知识一起嵌入到一个预设的提示词模板中。
- **生成**：将经过检索增强的提示词内容输入到大型语言模型中，以生成所需的输出。

![Untitled.png](images/e6d87ac6-dd5b-48b1-8e18-93f7435fdb4a_bb3e2bb29ab0f561cccfbcff60ff2fc4.png)


# 向量数据库


[向量检索Chroma使用和服务端docker部署](https://www.notion.so/34871ffa62bc4995af006faaca757ac8)


[使用ES混合检索](https://python.langchain.com/v0.2/docs/integrations/retrievers/elasticsearch_retriever/#hybrid-search)


[原生ES混合检索](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-knn-query.html)


# **Agent**


[bookmark](https://mp.weixin.qq.com/s?__biz=MzA3MzI4MjgzMw==&mid=2650890550&idx=1&sn=b92ded779dfc401aaacf00a68e32e916&chksm=84e4a548b3932c5eba6fd1f3c4c575380465aae1a89b584eac16a1ed3f1933fcf0f24c523bd5&mpshare=1&scene=1&srcid=0917RxDqIAmX76nofgOstNVv&sharer_shareinfo=c4bcc6b5d99e9f253a2d5d02995760dd&sharer_shareinfo_first=c4bcc6b5d99e9f253a2d5d02995760dd&version=4.1.10.6007&platform=win#rd)

