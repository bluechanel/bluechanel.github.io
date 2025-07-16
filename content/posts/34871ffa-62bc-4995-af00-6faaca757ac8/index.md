---
title: 🍚 向量检索Chroma使用和服务端docker部署
description: 介绍向量检索数据库Chroma的服务端Docker部署，以及客户端基本的使用
date: 2024-08-23
tags: ["RAG","Vector Store"]
cover:
    image: images/34871ffa-62bc-4995-af00-6faaca757ac8_0811b826df695886a5343f75e23b570b.png
ShowToc: true
---

# 部署

1. clone项目，自行打包docker（docker hub 镜像更新落后）

    ```python
    git clone https://github.com/chroma-core/chroma.git
    ```

2. 生成随机Tokens令牌

    ```python
    import secrets
    
    # 生成一个随机的Token令牌
    token = secrets.token_urlsafe(32)  # 生成一个32字节的URL安全令牌
    print(token)
    ```

3. 创建环境变量`.chroma_env`文件，写入下面的内容

    ```python
    CHROMA_SERVER_AUTHN_CREDENTIALS="your-token"
    CHROMA_SERVER_AUTHN_PROVIDER="chromadb.auth.token_authn.TokenAuthenticationServerProvider"
    ```

4. 启动

    ```python
    docker compose up -d
    ```


# 使用

1. 连接

    ```python
    import chromadb
    
    client = chromadb.HttpClient(host="127.0.0.1",
                                   port=8000,
                                   settings=chromadb.Settings(
                                       chroma_client_auth_provider="chromadb.auth.token_authn.TokenAuthClientProvider",
                                       chroma_client_auth_credentials="your_token"))
    ```

2. 创建colletion，并使用兼容langchain的embedding

    embedding 部署见[Embedding+Rerank部署](https://www.notion.so/19f605eee88980758d31f6b62294b77b#544a313750d84f1ca40c64488273a849) 


    ```python
    from chromadb.utils import embedding_functions
    from langchain_openai import OpenAIEmbeddings
    embedding = embedding_functions.create_langchain_embedding(OpenAIEmbeddings())
    collection = client.get_or_create_collection(name="test", embedding_function=embedding)
    ```

3. 添加数据

    ```python
    collection.add(ids=["1"],
                       documents="test",
                       metadatas={"author":"admin"})
    ```

4. 查询collection数据量

    ```python
    collection.count()
    ```

5. 简单查询collection

    ```python
    collection = client.get_collection("test", embedding_function=embedding)
    r = collection.query(query_texts="test", n_results=1)
    ```

