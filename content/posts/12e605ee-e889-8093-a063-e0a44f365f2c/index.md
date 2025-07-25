---
title: ♨️ 向量数据库Milvus混合检索
description: 介绍Milvus的使用，以及混合检索示例代码
date: 2024-10-29
updateDate: 2025-02-05
tags: ["RAG","LLM","Vector Store"]
cover:
    image: images/12e605ee-e889-8093-a063-e0a44f365f2c_08c5eab9196a574179ecff097a7188e2.png
ShowToc: true
---

# 官网


[bookmark](https://milvus.io/docs)


# 部署


[https://milvus.io/docs/install-overview.md](https://milvus.io/docs/install-overview.md)


Milvus支持Docker，K8S等部署方式，轻度使用也可使用**Milvus Lite**在本地


[embed](https://i0.img2ipfs.com/ipfs/Qmcz2LM5cA1S5DRhFh43JArjNBtw7wLaFPZgxHwFdpaaYz?filename=image.jpg)


**docker compose 模式部署**，如果开启身份验证，参考[文档](https://milvus.io/docs/zh/authenticate.md?tab=docker)。
milvus.yaml文件在[github](https://github.com/milvus-io/milvus/blob/90948e94446e7009eb4d27359ddb2ceab9d7b7d7/configs/milvus.yaml#L4)，下载后映射进docker即可。


# 使用


## 过时内容

## 创建Collection


### Collection Schema设置


设置稠密向量字段，dim字段指embedding模型的维数，一般有512，1024，2048等
`FieldSchema(name="dense_vector", dtype=DataType.FLOAT_VECTOR, dim=2048)`


设置稀疏向量字段，注意数据类型必须是`DataType.SPARSE_FLOAT_VECTOR`，不需要设置dim
`FieldSchema(name="sparse_vector", dtype=DataType.SPARSE_FLOAT_VECTOR)`


设置文本字段，数据类型为`DataType.VARCHAR`，一个中文字符最多可能占用4个字节，设置时需要注意
`FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=3000)`


完整示例代码


```python
schema = CollectionSchema([
    FieldSchema(name="id", dtype=DataType.VARCHAR, max_length=32, is_primary=True),
    # 稠密向量创建
    FieldSchema(name="dense_vector", dtype=DataType.FLOAT_VECTOR, dim=2048),
    # 稀疏向量创建
    FieldSchema(name="sparse_vector", dtype=DataType.SPARSE_FLOAT_VECTOR),
    # 文本
    FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=3000),
    # 文档来源地址
    FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=256),
])
collection = Collection("test_collection", schema)
```


### 索引设置


不同的数据类型，其索引类型，向量计算方式都不同，稠密向量一般有L2(欧式距离)，IP(内积)，COSINE(余弦相似度)，稀疏向量，目前只支持IP， 详细情况见[官方说明](https://milvus.io/docs/index-vector-fields.md?tab=floating)


```python
# 创建稠密向量index
collection.create_index(field_name="dense_vector",
                        index_params={"metric_type": "L2", "index_type": "IVF_FLAT",
                                      "params": {"nlist": 128}})

# 创建稀疏向量index  https://milvus.io/docs/zh/index.md?tab=sparse
collection.create_index(field_name="sparse_vector",
                        index_params={"metric_type": "IP", "index_type": "SPARSE_WAND",
                                      "params": {"drop_ratio_search": 0.5}})
```


### 加载Collection


在Milvus创建Collection后，必须load才可以使用


```python
collection.load()
```


## 插入数据


```python
data = [["xxxx"],[[0.1,0.2,0.3]],[0.1,0.2,0.3],["xxxx"],["xxxx"]]
res = collection.insert(data)
print(f"数据插入情况 {res.insert_count}")
```


## 搜索


### 向量搜索


```python
query_embedding = [0.1,0.2,0.3]
search_param = {
	"data": [query_embedding],
  "anns_field": "films",
  "param": {"metric_type": "L2", "offset": 1},
  "limit": 2,
  "expr": "film_id > 0",
}
res = collection.search(**search_param)
```


### 混合搜索


```python
query_dense_embedding = [[0.1,0.2,0.3],[0.4,0.5,0.6]]
query_sparse_embedding = [[0.1,0.2,0.3],[0.4,0.5,0.6]]
dense_search_params = {"metric_type": "L2", "params": {"nlist": 128}}
dense_req = AnnSearchRequest(
    query_dense_embedding, "dense_vector", dense_search_params, limit=limit
)
sparse_search_params = {
    "metric_type": "IP",
    "params": {"drop_ratio_search": 0.5},
}
sparse_req = AnnSearchRequest(
    query_sparse_embedding, "sparse_vector", sparse_search_params, limit=limit
)

rerank = RRFRanker() # 使用RRF Rerank
res = col.hybrid_search(
    [dense_req, sparse_req],
    rerank=rerank,
    limit=limit,
    output_fields=["text", "source"],
)
```


# 扩展


## BM25稀疏向量构建

1. 读取所有文本，构建语料库的统计数据

    ```python
    from milvus_model.sparse.bm25.bm25 import BM25EmbeddingFunction
    from milvus_model.sparse.bm25.tokenizers import build_default_analyzer
    docs = ["aaa","bbb","cccc"]
    analyzer = build_default_analyzer(language="zh")
    bm25_ef = BM25EmbeddingFunction(analyzer)
    bm25_ef.fit(docs)
    bm25_ef.save("aaa.json")
    ```

2. 加载并使用

    ```python
    from milvus_model.sparse.bm25.bm25 import BM25EmbeddingFunction
    from milvus_model.sparse.bm25.tokenizers import build_default_analyzer
    queries = ["aaa","bbb","ccc"]
    analyzer = build_default_analyzer(language="zh")
    bm25_ef = BM25EmbeddingFunction(analyzer)
    # 加载上一步分析得出的结论
    bm25_ef.load("aaa.json")
    # 生成文本向量
    print(bm25_ef.encode_documents(texts))
    ```

3. 生成查询向量

    ```python
    from milvus_model.sparse.bm25.bm25 import BM25EmbeddingFunction
    from milvus_model.sparse.bm25.tokenizers import build_default_analyzer
    queries = ["aaa","bbb","ccc"]
    analyzer = build_default_analyzer(language="zh")
    bm25_ef = BM25EmbeddingFunction(analyzer)
    # 加载上一步分析得出的结论
    bm25_ef.load("aaa.json")
    # 生成查询文本向量
    print(bm25_ef.encode_queries(queries))
    ```


# 完整示例


```python
from typing import List

from milvus_model.sparse.bm25.bm25 import BM25EmbeddingFunction
from milvus_model.sparse.bm25.tokenizers import build_default_analyzer
from pymilvus import AnnSearchRequest, RRFRanker, connections, CollectionSchema, FieldSchema, DataType, Collection

# milvus连接
conn = connections.connect(
    uri="http://127.0.0.1:19530", user="root", password="2024", db_name="test"
)
# 准备的测试文档
docs = ["是信息检索中的一种排序函数，用于估计文档与给定搜索查询的相关性。","它结合了文档长度归一化和术语频率饱和，从而增强了基本术语频率方法。","BM25 可以通过将文档表示为术语重要性得分向量来生成稀疏嵌入，从而在稀疏向量空间中实现高效检索和排序。"]
# 计算bm25统计信息
analyzer = build_default_analyzer(language="zh")
bm25_ef = BM25EmbeddingFunction(analyzer)
bm25_ef.fit(docs)
bm25_ef.save("a.json")
# 创建schema
schema = CollectionSchema(
    [
        FieldSchema(
            name="id", dtype=DataType.VARCHAR, max_length=32, is_primary=True
        ),
        # 稠密向量创建
        FieldSchema(name="dense_vector", dtype=DataType.FLOAT_VECTOR, dim=1536),
        # 稀疏向量创建
        FieldSchema(name="sparse_vector", dtype=DataType.SPARSE_FLOAT_VECTOR),
        # 文本
        FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=3000),
        # 文档来源地址
        FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=256),
        # 文档类型
        FieldSchema(name="category", dtype=DataType.VARCHAR, max_length=10),
    ]
)
# 创建collection
collection = Collection("test_collection", schema)
# 创建稠密向量index
collection.create_index(
    field_name="dense_vector",
    index_params={
        "metric_type": "L2",
        "index_type": "IVF_FLAT",
        "params": {"nlist": 128},
    },
)

# 创建稀疏向量index  https://milvus.io/docs/zh/index.md?tab=sparse
collection.create_index(
    field_name="sparse_vector",
    index_params={
        "metric_type": "IP",
        "index_type": "SPARSE_WAND",
        "params": {"drop_ratio_search": 0.5},
    },
)
# 加载collection
collection.load()

# 加载上一步的bm25统计信息
bm25_ef.load("a.json")
def hybrid_search(
        queries: List[str],
        limit: int = 10,
):
    # embedding
    from  langchain_openai.embeddings import OpenAIEmbeddings
    embedding = OpenAIEmbeddings()
    query_dense_embedding = embedding.embed_documents(queries)
    query_sparse_embedding = bm25_ef.encode_queries(queries)
    dense_search_params = {"metric_type": "L2", "params": {"nlist": 128}}
    dense_req = AnnSearchRequest(
        query_dense_embedding, "dense_vector", dense_search_params, limit=limit
    )
    sparse_search_params = {
        "metric_type": "IP",
        "params": {"drop_ratio_search": 0.5},
    }
    sparse_req = AnnSearchRequest(
        query_sparse_embedding, "sparse_vector", sparse_search_params, limit=limit
    )

    rerank = RRFRanker()
    res = collection.hybrid_search(
        [dense_req, sparse_req],
        rerank=rerank,
        limit=limit,
        output_fields=["text", "source"],
    )
    print(res)

queries = ["信息检索中的排序函数", "稀疏向量空间中实现高效检索和排序"]

hybrid_search(queries=queries)
```


## 基础


**混合搜索**一般指全文检索+向量检索，**多路召回**指从多个collection中搜索结果。


### 创建collection schema


混合检索需要同时具有 稀疏向量和 稠密向量


```python
schema = MilvusClient.create_schema()

schema.add_field(
    field_name="pk",
    datatype=DataType.VARCHAR,
    is_primary=True,
    auto_id=True,
    max_length=100,
)
# 稀疏向量的数据类型必须是SPARSE_FLOAT_VECTOR
schema.add_field(
    field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR
)
schema.add_field(
    field_name="dense_vector", datatype=DataType.FLOAT_VECTOR, dim=dense_dim
)
schema.add_field(field_name="metadata", datatype=DataType.JSON)
```


milvus支持数据类型如 int、float、doublt、varchar、bool、json、array等。


### 全文检索函数添加


```python
functions = Function(
    name="bm25",
    function_type=FunctionType.BM25,
    input_field_names=["content"],
    output_field_names="sparse_vector",
)

schema.add_function(functions)
```


### 添加索引


为需要检索的列设置索引


```python
index_params = MilvusClient.prepare_index_params()
# 索引配置使用参考文档 
https://milvus.io/docs/index-vector-fields.md?tab=floating

index_params.add_index(
    field_name="sparse_vector",
    index_type="SPARSE_INVERTED_INDEX",
    metric_type="BM25",
)
index_params.add_index(
    field_name="dense_vector", index_type="IVF_FLAT", metric_type="IP"
)
```


## Milvus 混合搜索完整示例代码


```python
import hashlib
from typing import List, Literal, Self

from milvus_model import dense
from pydantic import BaseModel, Field, model_validator
from pymilvus import (
    AsyncMilvusClient,
    MilvusClient,
    DataType,
    Function,
    FunctionType,
    AnnSearchRequest,
    RRFRanker,
)


class ChunkBase(BaseModel):
    content: str
    doc_type: str = Field(max_length=128)
    source: str = Field(max_length=256)
    metadata: dict


class CreateChunk(ChunkBase):
    original_uuid: str | None = None

    @model_validator(mode="after")
    def compute_id(self) -> Self:
        # auto compute md5 id
        self.original_uuid = hashlib.md5(self.content.encode("utf-8")).hexdigest()
        return self


class SearchChunk(ChunkBase):
    original_uuid: str
    score: float

class MilvusRetriever:
    def __init__(
        self, uri: str, token: str, db_name: str, dense_embedding_function: dense
    ):
        self.embedding_function = dense_embedding_function
        self.aclient = AsyncMilvusClient(uri=uri, token=token, db_name=db_name)
        self.client = MilvusClient(uri=uri, token=token, db_name=db_name)

    async def build_collection(self, collection_name: str):
        if isinstance(self.embedding_function.dim, dict):
            dense_dim = self.embedding_function.dim["dense"]
        else:
            dense_dim = self.embedding_function.dim
				
				# 关于分析器的详细配置，参考文档 https://milvus.io/docs/analyzer-overview.md，中文是用jieba
        tokenizer_params = {
            "tokenizer": "jieba",
            "type": "chinese",
            "filter": ["cnalphanumonly"],
        }

        schema = self.client.create_schema()
        schema.add_field(
            field_name="pk",
            datatype=DataType.VARCHAR,
            is_primary=True,
            auto_id=True,
            max_length=100,
        )
        schema.add_field(
            field_name="content",
            datatype=DataType.VARCHAR,
            max_length=65535,
            analyzer_params=tokenizer_params,
            enable_match=True,
            enable_analyzer=True,
        )
        schema.add_field(
            field_name="sparse_vector", datatype=DataType.SPARSE_FLOAT_VECTOR
        )
        schema.add_field(
            field_name="dense_vector", datatype=DataType.FLOAT_VECTOR, dim=dense_dim
        )
        schema.add_field(
            field_name="original_uuid", datatype=DataType.VARCHAR, max_length=128
        )
        schema.add_field(
            field_name="doc_type", datatype=DataType.VARCHAR, max_length=128
        )
        schema.add_field(field_name="source", datatype=DataType.VARCHAR, max_length=256)
        schema.add_field(field_name="metadata", datatype=DataType.JSON)

        functions = Function(
            name="bm25",
            function_type=FunctionType.BM25,
            input_field_names=["content"],
            output_field_names="sparse_vector",
        )

        schema.add_function(functions)

        index_params = MilvusClient.prepare_index_params()
        index_params.add_index(
            field_name="sparse_vector",
            index_type="SPARSE_INVERTED_INDEX",
            metric_type="BM25",
        )
        index_params.add_index(
            field_name="dense_vector", index_type="IVF_FLAT", metric_type="IP"
        )

        await self.aclient.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params,
        )

        await self.aclient.load_collection(collection_name=collection_name)

    async def insert_data(self, collection_name: str, chunks: List[CreateChunk]):
        # batch
        for i in range(0, len(chunks), 20):
            sub_chunks = chunks[i : i + 20]
            embeddings = self.embedding_function(
                [chunk.content for chunk in sub_chunks]
            )
            data = []
            for i, embedding in enumerate(embeddings):
                data.append(
                    {
                        "dense_vector": embedding,
                        "content": sub_chunks[i].content,
                        "original_uuid": sub_chunks[i].original_uuid,
                        "doc_type": sub_chunks[i].doc_type,
                        "source": sub_chunks[i].source,
                        "metadata": sub_chunks[i].metadata,
                    }
                )
            await self.aclient.insert(collection_name, data=data)

    async def search(
        self,
        collection_name: str,
        query: str,
        k: int = 20,
        mode: Literal["hybrid", "dense", "sparse"] = "hybrid",
    ) -> List[SearchChunk]:
        output_fields = ["content", "original_uuid", "source", "doc_type", "metadata"]
        if mode in ["dense", "hybrid"]:
            embedding = self.embedding_function([query])
            if isinstance(embedding, dict) and "dense" in embedding:
                dense_vec = embedding["dense"][0]
            else:
                dense_vec = embedding[0]

        if mode == "sparse":
            results = await self.aclient.search(
                collection_name=collection_name,
                data=[query],
                anns_field="sparse_vector",
                limit=k,
                output_fields=output_fields,
            )
        elif mode == "dense":
            results = await self.aclient.search(
                collection_name=collection_name,
                data=[dense_vec],
                anns_field="dense_vector",
                limit=k,
                output_fields=output_fields,
            )
        elif mode == "hybrid":
            full_text_search_params = {"metric_type": "BM25"}
            full_text_search_req = AnnSearchRequest(
                [query], "sparse_vector", full_text_search_params, limit=k
            )

            dense_search_params = {"metric_type": "IP"}
            dense_req = AnnSearchRequest(
                [dense_vec], "dense_vector", dense_search_params, limit=k
            )

            results = await self.aclient.hybrid_search(
                collection_name,
                [full_text_search_req, dense_req],
                ranker=RRFRanker(),
                limit=k,
                output_fields=output_fields,
            )
        else:
            raise ValueError("Invalid mode")
        return [
            SearchChunk(
                original_uuid=doc["entity"]["original_uuid"],
                content=doc["entity"]["content"],
                source=doc["entity"]["source"],
                doc_type=doc["entity"]["doc_type"],
                metadata=doc["entity"]["metadata"],
                score=doc["distance"],
            )
            for doc in results[0]
        ]
  if __name__ == '__main__':
    from pymilvus import model

    openai_ef = model.dense.OpenAIEmbeddingFunction(
        api_key="sk-xxxx",
        model_name="embedding-v3"
    )

    milvus_retriever = MilvusRetriever(
        uri="http://127.0.0.1:19530",
        token="root:Milvus",
        db_name="test",
        dense_embedding_function=openai_ef,
    )
    # milvus_retriever.search(collection_name="hybrid", query="什么是LLM")
```

