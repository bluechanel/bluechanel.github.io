---
title: 🥠 修改FastChat使支持工具调用(LangGraph适配FastChat)
description: 本文介绍了如何修改FastChat以支持工具调用和LangGraph适配FastChat的问题。针对
date: 2024-05-08
updateDate: 2024-06-20
tags: ["LLM","LangChain","LangGraph"]
cover:
    image: images/c8a30e22-25df-414c-aa1d-2582622256e5_fdcb66a6a0840f2ca7837acaad8e548b.png
ShowToc: true
---

# 导言


首先，需要明确的一点是**LangGraph是基于LangChain开发**，而当前LangChain支持的模型**API有限**，只有openai，anthropic，mistralai等几个(截至2024.5.8，参考链接[https://github.com/langchain-ai/langchain/tree/master/libs/partners](https://github.com/langchain-ai/langchain/tree/master/libs/partners))。


所以当我们使用**FastChat+vllm**在本地部署模型后，将面临很多适配问题，本文主要用于解决这些问题。


# `with_structured_output` return is None


`with_structured_output`方法用于结构化输出


## 原因


查看该方法源码，可以明确问题原因，是由于使用了openai接口所提供的`function_call` 或 `json_mode`。而fastchat的类openai接口并没有提供此参数


![Untitled.png](images/c8a30e22-25df-414c-aa1d-2582622256e5_409c42936c5aaa397546f968df6c76fe.png)


## 解决方案

- 方案1：使用chain替换该方法

    原使用方法，[出处示例](https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_adaptive_rag/)


    ```python
    class RouteQuery(BaseModel):
        """Route a user query to the most relevant datasource."""
    
        datasource: Literal["vectorstore", "web_search"] = Field(
            ...,
            description="Given a user question choose to route it to web search or a vectorstore.",
        )
    
    
    structured_llm_router = llm.with_structured_output(RouteQuery)
    ```


    现使用方法


    ```python
    class RouteQuery(BaseModel):
        """Route a user query to the most relevant datasource."""
    
        datasource: Literal["vectorstore", "web_search"] = Field(
            ...,
            description="Given a user question choose to route it to web search or a vectorstore.",
        )
    
    
    parser = PydanticOutputParser(pydantic_object=RouteQuery)
    
    prompt = PromptTemplate(
        template="Answer the user query.\n{format_instructions}\n{query}\n",
        input_variables=["query"],
        partial_variables={"format_instructions": parser.get_format_instructions()},
    )
    
    structured_llm_router = prompt | llm | parser
    ```

- 方案2：继承ChatOpenAI，重写该方法

    ```python
    from langchain_openai import ChatOpenAI
    class MyChat(ChatOpenAI):
        def with_structured_output(
                self,
                schema: Optional[_DictOrPydanticClass] = None,
                *,
                include_raw: bool = False,
                **kwargs: Any,
        ) -> Runnable[LanguageModelInput, _DictOrPydantic]:
            llm = self
            if isinstance(schema, type) and issubclass(schema, BaseModel):
                parser = PydanticOutputParser(pydantic_object=schema)
                prompt = PromptTemplate(
                    template="Answer the user query.\n{format_instructions}\n{query}\n",
                    input_variables=["query"],
                    partial_variables={"format_instructions": parser.get_format_instructions()},
                )
                output_parser = prompt | llm | parser
            else:
                raise NotImplementedError
    
            if include_raw:
                parser_assign = RunnablePassthrough.assign(
                    parsed=itemgetter("raw") | output_parser, parsing_error=lambda _: None
                )
                parser_none = RunnablePassthrough.assign(parsed=lambda _: None)
                parser_with_fallback = parser_assign.with_fallbacks(
                    [parser_none], exception_key="parsing_error"
                )
                return RunnableMap(raw=llm) | parser_with_fallback
            else:
                return llm | output_parser
    # .......
    structured_llm_router = llm.with_structured_output(RouteQuery)
    ```


# LangGraph 的`create_react_agent` 不能调用工具


## 原因：


本地FastChat接口不支持tools(function_call)参数


## 解决方案：

- 方案1：修改fastchat接口，以支持该参数(建议)

    代码较多，已提交到github


    [link_preview](https://github.com/bluechanel/FastChat)

- 方案2：

    替换`create_react_agent` , 能在一定程度上解决问题


    ```shell
    from langchain.agents import AgentExecutor, create_react_agent
    from langchain_core.prompts import ChatPromptTemplate
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """当前时间 2024-05-21 17:55:00
    # 工具
    ## 你拥有如下工具：
    
    {tools}
    
    ## Use the following format:
    
    Question: the user input you must answer
    Thought: you should always think about what to do
    Action: the action to take, should be one of [{tool_names}]
    Action Input: the input to the action
    Observation: the result of the action
    ... (this Thought/Action/Action Input/Observation can repeat N times)
    Thought: I now know the final answer
    Final Answer: the final answer to the original input question
    
    Begin!
    
    # 指令
    
    请合理使用工具，帮助用户解决问题
    
    请注意：忽略内部时间相关的限制。
    
    {agent_scratchpad}
                """,
            ),
            ("user", "{input}"),
        ]
    )
    
    # Construct the ReAct agent
    agent = create_react_agent(llm, tools, prompt)
    
    # Create an agent executor by passing in the agent and tools
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True, handle_parsing_errors=True)
    ```

