---
title: LLM部署
pageId: 19f605ee-e889-8075-8d31-f6b62294b77b
description: 
date: 2025-02-19
updateDate: 2025-02-19
tags: []
cover: 
---

# LLM部署

1. clone 项目，并进入llm目录

```shell
git clone https://github.com/bluechanel/deploy_llm.git
cd deploy_llm/llm
```

2. 修改模型映射路径，`vim docker-compose.yaml`

```shell
x-common:
  &common
  volumes:
  # 修改为自己下载模型的地址映射到容器/models
- /data/models:/models
  environment:
  # 时区设置
&common-env
TZ: "Asia/Shanghai"
```

修改模型启动命令，在vllm服务中，修改`--served-model-name` 为自定义模型名称   `--model`为修改后的模型路径，`--tensor-parallel-size 4`为使用显卡数量，根据实际情况修改

```shell
command: [ "--model","/models/qwen/Qwen2___5-72B-Instruct-GPTQ-Int8",  "--host", "0.0.0.0", "--port", "8000", "--served-model-name", "gpt-4", "--enable-auto-tool-choice", "--tool-call-parser", "hermes","--distributed-executor-backend","ray","--tensor-parallel-size","4","--pipeline-parallel-size", "1" ]
```

3. 启动`docker compose up -d`

4. 查看api文档`http://ip:1281/docs`

## Embedding+Rerank部署


> 💡 embedding 和 rerank是两个模型，可直接在modelscope搜索rerank找相关模型

1. 进入embedding目录

2. 修改模型映射路径，`vim docker-compose.yaml`

```shell
x-common:
  &common
  volumes:
  # 修改为自己下载模型的地址映射到容器/models
- /data/models:/models
  environment:
  # 时区设置
&common-env
TZ: "Asia/Shanghai"
```

修改embedding启动命令，修改`--model-id`为修改后的模型路径

```shell
command: [ "--json-output", "--model-id", "/models/maple77/gte-large-zh"]
```

3. 启动`docker compose up -d`

4. 查看api文档embedding: `http://ip:1282/docs` rerank:`http://ip:1283/docs`

![Untitled.png](images/19f605ee-e889-8075-8d31-f6b62294b77b/19f605ee-e889-8075-8d31-f6b62294b77b_358e8bcac991860e8256d597a4f27e3f.png)

**排错**

vllm启动可能会有如下报错，在docker compose中修改`shm_size`的值为错误提示的值，即可

![Untitled.png](images/19f605ee-e889-8075-8d31-f6b62294b77b/19f605ee-e889-8075-8d31-f6b62294b77b_7ca341ec25a450e85cdfcee0df2af03e.png)
