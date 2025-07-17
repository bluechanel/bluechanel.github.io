---
title: 🍚 向量/混合检索-Elasticsearch
description: 介绍ES的docker部署，以及在RAG应用中，向量和混合检索的使用
date: 2024-10-11
updateDate: 2024-10-24
tags: ["RAG","Vector Store"]
cover:
    image: images/11c605ee-e889-80ae-8ef8-f4497de6e3d5_26b46fb1baae0d581df27ab37a57b445.png
ShowToc: true
---

# ES本地部署


[官方部署手册](https://www.elastic.co/guide/en/elasticsearch/reference/8.15/docker.html)


这里我们直接使用官方的`docker-compose`文件部署


[bookmark](https://github.com/elastic/elasticsearch/tree/8.15/docs/reference/setup/install/docker)


> 💡 注意修改.env文件中的密码信息


# 使用

1. 使用es客户端进行连接

    ```python
    es_connection = Elasticsearch("http://127.0.0.1:9200", basic_auth=("elastic", "xxxxxx"))
    ```


    > 💡 ES python客户端更多连接方式，见下面的官方文档  
    > [bookmark](https://www.elastic.co/guide/en/elasticsearch/client/python-api/current/connecting.html#connect-self-managed-new)

2. 向量检索

    ```python
    vector = [0.1,0.1,0.1]
    query_body = {
            "query": {"knn": {"field": "vector", "query_vector": vector, "k": 3}},
            "_source": ["text", "metadata"],
            "size": 3,
      }
    es_response = es_connection .search(
        index=index_name, body=query_body
    )
    ```


    更多内容见[官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/8.15/knn-search.html)

3. 混合检索

    混合检索指 **稠密向量+稀疏向量**，因此，混合检索后要使用Rerank进行重排。


    Rerank策略有三种：

    - 加权评分
    - RRF（互惠排序融合）
    - 使用Rerank模型

    ES[官方](https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html#rrf-retriever)提供了RRF重新计算评分，不过该功能并不在自管型ES中提供，使用会提示license不支持。未经尝试。


    这里我们使用构建 向量检索（稠密向量）+全文检索（ES的全文检索自5.0后模型采用BM25计算相似性）的ES查询体，然后再使用**Rerank模型**进行重排


    ```python
    # ES 查询体
    queries = ["CAD方法", "CAD是什么","CAD有哪些方法"]
    vectors = await embeddings.aembed_documents(texts=queries)
    bm = [{"match": {"text": {"query": text, "boost": 1}}} for text in queries]
    
    knn = [
        {"knn": {"field": "vector", "query_vector": vector, "k": 3, "boost": 1000}}
        for vector in vectors
    ]
    body =  {
        "query": {"bool": {"should": bm + knn}},
        "_source": ["text", "metadata"],
        "size": 6 * len(queries),
    }
    es_response = es_connection .search(
        index=index_name, body=body
    )
    ```


    向量检索(KNN) 的得分范围为0-1，全文检索得分范围根据命中的关键词可能无限大。为了使knn检索的结果尽可能的包括在返回结果中，调整KNN查询的的boost为1000，原始得分*1000。(该方法存在问题，待研究)


    > 💡 关于Rerank模型部署参考[https://www.wileyzhang.com/llm部署dockervllmembeddingrerank-支持工具调用](https://www.wileyzhang.com/llm%E9%83%A8%E7%BD%B2dockervllmembeddingrerank-%E6%94%AF%E6%8C%81%E5%B7%A5%E5%85%B7%E8%B0%83%E7%94%A8)

