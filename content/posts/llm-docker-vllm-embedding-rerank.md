---
title: LLM部署(docker+vllm+embedding+rerank) 支持工具调用
pageId: 6e4516ff-0701-4009-9841-b0f023ca43a6
description: 该文档介绍了关于LLM模型部署的内容，包括模型选择、模型下载、模型部署方案以及模型使用和加速方法。推荐的部署方案是使用docker部署，同时提供了本地环境部署的方法。模型加速方面介绍了vllm和flash-attention两种方法。embdding模型，rerank模型
date: 2024-06-03
updateDate: 2026-08-19
tags: [LLM]
cover: cover/6e4516ff-0701-4009-9841-b0f023ca43a6_7a2d1d060c9fb10000ed4af843e17828.png
---

# 模型选择

LLM模型，Embedding模型选择参考下面的文章

<mention-page url="https://app.notion.com/p/4ab81ed776224ef19fc61e1ae4edbd99"/>

# 模型下载

当前提供模型的网站主要有[ModelScope](https://www.modelscope.cn/models)和[HuggingFace](https://huggingface.co/models)，下载方式主要是git lfs和平台封装两种方法

## ModelScope

1. 安装modelscope

```shell
pip install modelscope
```

2. 复制模型名称

![image.png](images/6e4516ff-0701-4009-9841-b0f023ca43a6/6e4516ff-0701-4009-9841-b0f023ca43a6_bcb9317bd2567d5b5ed4b4e712c69804.png)

3. 下载模型到指定目录

```shell
#模型下载
from modelscope import snapshot_download
# 注意替换模型名称，不指定目录，则默认下载到用户目录.cache/modelscope/
model_dir = snapshot_download('qwen/Qwen2.5-72B-Instruct-GPTQ-Int8', cache_dir='/data/models/')
```

# 模型部署

## LLM、Embedding、Rerank docker部署

1. 安装docker，国内使用[清华开源软件镜像站](https://mirror.tuna.tsinghua.edu.cn/help/docker-ce/)

2. [安装](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)[**NVIDIA Container Toolkit**](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

3. 使用docker compose 部署，部署文件见下面的github地址

[https://github.com/bluechanel/deploy_llm/tree/main](https://github.com/bluechanel/deploy_llm/tree/main)

4. clone 项目

```json
git clone git@github.com:bluechanel/deploy_llm.git
cd deploy_llm
```

5. 修改模型保存目录

```yaml
x-vllm-common:
  &common
  image: vllm/vllm-openai:latest
  restart: unless-stopped
  environment:
TZ: "Asia/Shanghai"
  volumes:
- /data/models:/models # 此处修改为实际模型目录。
  networks:
- vllm
```

6. 修改模型启动参数

vllm的更多参数见[vllm文档](https://docs.vllm.ai/en/stable/serving/openai_compatible_server.html#cli-reference)

1. LLM

修改command 里面的 `—-model` 后面的模型目录，映射到docker中的目录

```yaml
command: [ "--model","/models/{你的模型目录}",  "--enable-prefix-caching","--host", "0.0.0.0", "--port", "8000", "--served-model-name", "gpt-4", "--distributed-executor-backend","ray","--tensor-parallel-size","2","--pipeline-parallel-size", "1","--enable-reasoning","--reasoning-parser","deepseek_r1"]
```

这里有几个常用参数说明

`--served-model-name`：模型调用名称，可以自定义填写任意名称

`--tensor-parallel-size`：并行数量，取决于使用的显卡数量  
`--enable-prefix-caching`：开启前缀缓存，对多轮对话有一定效率提升

`"--enable-reasoning", "--reasoning-parser","deepseek_r1"` 如果是推理模型，可以配置该参数，目前支持`deepseek_r1`系列

`"--enable-auto-tool-choice", "--tool-call-parser", "hermes”`：开启工具调用能力，例如Qwen2.5 系列模型，参考

```yaml
command: [ "--model","/models/qwen/Qwen2___5-72B-Instruct-GPTQ-Int8", "--enable-prefix-caching", "--host", "0.0.0.0", "--port", "8000", "--served-model-name", "gpt-4", "--enable-auto-tool-choice", "--tool-call-parser", "hermes","--distributed-executor-backend","ray","--tensor-parallel-size","2","--pipeline-parallel-size", "1" ]
```

2. Embedding

修改command 里面的 `—-model` 后面的模型目录为映射到docker中的embedding模型目录

```yaml
command: [ "--model","/models/{你的模型目录}",  "--host", "0.0.0.0", "--port", "8000", "--task", "embed", "--served-model-name", "gte-large-zh"]
```

3. Rerank

修改command 里面的 `—-model` 后面的模型目录为映射到docker中的reranker模型目录

```yaml
command: [ "--model","/models/{你的模型目录}",  "--host", "0.0.0.0", "--port", "8000", "--task", "score", "--served-model-name", "bge-reranker-base"]
```

7. 使用docker compose 启动模型

```json
docker compose up -d
```

模型启动后，docker对外暴露在8000端口，访问`http://ip:8000/docs`查看接口文档

8. 测试，使用demo脚本测试。注意修改 各模型的自定义名称

```json
python demo.py
```

<mention-page url="https://app.notion.com/p/19f605eee88980758d31f6b62294b77b"/>

<mention-page url="https://app.notion.com/p/106605eee889808f99f9c82410f6ad2a"/>

# 模型使用

在langchian中套壳ChatOpenAI使用，或直接使用OpenAI SDK，可参考demo.py

### LLM

**方式1**

```shell
from langchain_openai import ChatOpenAI
from langchain_core.pydantic_v1 import SecretStr

class MyChat(ChatOpenAI):
    openai_api_base = "http://ip:1282/v1"
    openai_api_key = SecretStr("123456")
    model_name = "Qwen-14B-Chat"
    max_tokens = 1024# 依据不同模型支持的长度进行调整

llm=MyChat(temperature=0)
```

**方式2**

```python
os.environ.setdefault("OPENAI_API_KEY", "12123123")
os.environ.setdefault("OPENAI_API_BASE", "http://ip:1282/v1")
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model_name="Qwen-14B-Chat")
```

### Embedding

```shell
from langchain_openai import OpenAIEmbeddings
from pydantic.v1 import SecretStr


class TaliAPIEmbeddings(OpenAIEmbeddings):
    openai_api_base = "http://ip:1281/v1"
    openai_api_key = SecretStr("123456")
    check_embedding_ctx_length = False

```

# 模型加速

1. [vllm](https://github.com/vllm-project/vllm)

2. [flash-attention](https://github.com/Dao-AILab/flash-attention)

安装遇到的问题：

1. OSError: CUDA_HOME environment variable is not set. Please set it to your CUDA install root.

指定cuda home地址

`CUDA_HOME=/usr/local/cuda-11.8 python `[`setup.py`](http://setup.py/)` install`or`CUDA_HOME=/usr/local/cuda-11.8 pip install flash-attn --no-build-isolation`
