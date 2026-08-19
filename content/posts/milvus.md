---
title: 向量数据库Milvus混合检索
pageId: 12e605ee-e889-8093-a063-e0a44f365f2c
description: 介绍Milvus的使用，以及混合检索示例代码
date: 2024-10-29
updateDate: 2026-08-19
tags: [RAG, LLM, VectorStore]
cover: cover/12e605ee-e889-8093-a063-e0a44f365f2c_08c5eab9196a574179ecff097a7188e2.png
---

# 官网

[https://milvus.io/docs](https://milvus.io/docs)

# 部署

[https://milvus.io/docs/install-overview.md](https://milvus.io/docs/install-overview.md)

Milvus支持Docker，K8S等部署方式，轻度使用也可使用**Milvus Lite**在本地

**docker compose 模式部署**，如果开启身份验证，参考[文档](https://milvus.io/docs/zh/authenticate.md?tab=docker)。  
milvus.yaml文件在[github](https://github.com/milvus-io/milvus/blob/90948e94446e7009eb4d27359ddb2ceab9d7b7d7/configs/milvus.yaml#L4)，下载后映射进docker即可。

# 使用

<page url="https://app.notion.com/p/191605eee8898078bb86c18a914ed706">过时内容</page>

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
# 索引配置使用参考文档 https://milvus.io/docs/index-vector-fields.md?tab=floating
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
