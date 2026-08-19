---
title: 模型部署
pageId: 106605ee-e889-808f-99f9-c82410f6ad2a
description: 
date: 2024-09-19
updateDate: 2024-09-19
tags: []
cover: 
---

# 模型部署

当前开源的模型部署服务很多，主流的有[FastChat、](https://github.com/lm-sys/FastChat)[Xinference](https://github.com/xorbitsai/inference)、[ollama](https://github.com/ollama/ollama)、[vllm](https://github.com/vllm-project/vllm)、[lightllm](https://github.com/ModelTC/lightllm)，其中vllm，lightllm主要是用于**模型加速**。同时FastChat等也支持使用vllm启动模型获得高效加速，不过这些部署服务都**不支持工具调用**，也就是OpenAI 接口的tools参数。遂我对FastChat的代码做了部分修改，使其**支持tools参数。**具体代码见github，（仅测试了Qwen系列）


> 💡 由于不同模型训练数据不同，同样的Prompt在不同的模型中结果差异较大，导致tools能力不稳定，该能力未提交FastChat原始仓库。

<unknown url="https://app.notion.com/p/106605eee889808f99f9c82410f6ad2a#31ea98ca681c4bde9067eccad3535dda" alt="bookmark"/>

{% mark color="red" %}推荐的部署方案为：FastChat+vllm{% /mark %}

## 方案1：docker部署(推荐)

1. 安装docker，国内使用[清华开源软件镜像站](https://mirror.tuna.tsinghua.edu.cn/help/docker-ce/)

2. [安装](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)[**NVIDIA Container Toolkit**](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)

3. 使用docker compose 部署，部署文件见下面的github地址

<unknown url="https://app.notion.com/p/106605eee889808f99f9c82410f6ad2a#ee40e594e3b84550b62903e43cbe29d0" alt="bookmark"/>

### LLM部署

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

修改模型启动命令，在`fastchat-model-worker`服务中，修改`--model-names` 为自定义模型名称   `--model-path`为修改后的模型路径，`"--num-gpus", "4"`为使用显卡数量，根据实际情况修改

```shell
entrypoint: [ "python3", "-m", "fastchat.serve.vllm_worker", "--model-names", "gpt-4", "--model-path", "/models/qwen/Qwen2-72B-Instruct-GPTQ-Int8", "--worker-address", "http://fastchat-model-worker:21002", "--controller-address", "http://fastchat-controller:21001", "--host", "0.0.0.0", "--port", "21002", "--num-gpus", "4" ]
```

3. 启动`docker compose up -d`

**注意:**

此版本Api接口使用的是支持{% mark color="red" %}**工具调用**{% /mark %}的，如果不需要，请修改`docker-compose.yaml`文件中`fastchat-api-server`的启动命令为

```shell
entrypoint: [ "python3", "-m", "fastchat.serve.openai_api_server", "--controller-address", "http://fastchat-controller:21001", "--host", "0.0.0.0", "--port", "8000" ]
```

4. 查看api文档`http://ip:1281/docs`

![Untitled.png](images/106605ee-e889-808f-99f9-c82410f6ad2a/106605ee-e889-808f-99f9-c82410f6ad2a_b38bdaf64eca9f8f568f0cb1a22d1120.png)

## 方案2：本地环境部署

使用fastchat加载模型（[支持模型](https://github.com/lm-sys/FastChat/blob/main/docs/model_support.md)），由于LLM都是由transformers开发，理论上fschat可以用于启动所有LLM

<unknown url="https://app.notion.com/p/106605eee889808f99f9c82410f6ad2a#759abc1df1e64cd5b2377ba1f40a8674" alt="external_object_instance"/>

```python
conda create -n fschat python=3.10

pip install fschat
```

命令行启动

```python
conda activate fschat
python -m fastchat.serve.cli --model-path /data/models/qwen/Qwen-14B-Chat
```

openai接口方式启动

```python
conda activate fschat
python -m fastchat.serve.controller
python -m fastchat.serve.model_worker --model-path /data/models/qwen/Qwen-14B-Chat
# 此处也可替换为使用vllm worker
# python -m fastchat.serve.vllm_worker --model-path /data/models/qwen/Qwen-14B-Chat
python -m fastchat.serve.openai_api_server --host 0.0.0.0 --port 1282
```

### supervisor 管理

```python
# 由于启动项较多，我们使用supervisor管理
pip install supervisor
```

supervisor 配置文件`supervisord.conf`增加如下内容，并创建文件夹`/data/supervisor/conf.d`

```python
[include]
files = /data/supervisor/conf.d/*.conf
```

在`/data/supervisor/conf.d`中创建`llm.conf`,写入如下内容, 重点是llm_model的启动参数，model_path用于指定模型文件的地址，对于多GPU，添加参数`--num-gpus 4 --max-gpu-memory "80GiB"`

```python
[program:llm_ctrl]
command=/home/jx/anaconda3/envs/fschat/bin/python3 -m fastchat.serve.controller
stdout_logfile=/data/supervisor/logs/ctrl.log

[program:llm_model]
command=/home/jx/anaconda3/envs/fschat/bin/python3 -m fastchat.serve.model_worker --model-path /data/models/qwen/Qwen-14B-Chat --num-gpus 4 --max-gpu-memory "80GiB"
stdout_logfile=/data/supervisor/logs/model.log

[program:llm_api]
command=/home/jx/anaconda3/envs/fschat/bin/python3 -m fastchat.serve.openai_api_server --host 0.0.0.0 --port 1282
stdout_logfile=/data/supervisor/logs/api.log
```
