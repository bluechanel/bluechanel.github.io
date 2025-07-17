---
title: 🚢 LLM部署(docker+vllm+embedding+rerank) 支持工具调用
description: 该文档介绍了关于LLM模型部署的内容，包括模型选择、模型下载、模型部署方案以及模型使用和加速方法。推荐的部署方案是使用docker部署，同时提供了本地环境部署的方法。模型加速方面介绍了vllm和flash-attention两种方法。embdding模型，rerank模型
date: 2024-06-03
updateDate: 2025-03-27
tags: ["LLM"]
cover:
    image: images/6e4516ff-0701-4009-9841-b0f023ca43a6_7a2d1d060c9fb10000ed4af843e17828.png
ShowToc: true
---

# 模型选择


LLM模型，Embedding模型选择参考下面的文章


[link_to_page](https://wileyzhang.com/posts/4ab81ed7-7622-4ef1-9fc6-1e1ae4edbd99)


# 模型下载


当前提供模型的网站主要有[ModelScope](https://www.modelscope.cn/models)和[HuggingFace](https://huggingface.co/models)，下载方式主要是git lfs和平台封装两种方法


## ModelScope

1. 安装modelscope

    ```shell
    pip install modelscope
    ```

2. 复制模型名称

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/94c1b3e8-aeeb-4fdb-adf5-fedb3bad4f75/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466UE5H4SW6%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T080840Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIQCsP0tiqMa679AUmhlvxVRi62ymUOhnxqJCV7KJ%2BPkSLwIgDDvrB9FREd3HFoCZX%2FCMfcSe2BCsWcGRVY502%2Fnbx98q%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDMLAh03ZjxOb%2BzhyESrcAxG3S8lBJeXZHzLCSkgV1SJJjq9wVZY2m0APRzjhnDAU48xLvuec%2BTZhlI8QzB3SPwWXPDbgT8BCVwA6B48uL1cPlPiNiklcpqsfCLTrj0TZu7CggyGY05n1yAnWTaV8mKqAmXle2PYeLFOJC2qBPMvz2gzsJhesELgjZh4Uas617N8qhkoy2nRMgYStKJDG7HJYU3lbVWaHEqWXVmD0VUi8QOl578SLP5IX78UjQ%2FZrk4STYP242WoQKeKYdG9yaURcnkbhVqTGwAYxk2xeUywXmYUFqHio8odNCrO5S0QQmQTn%2FHFsXITbAnMtNP7PzshWzHP6BwcvRLfOuzAz8yb%2FcZiLJJraE%2FjrNO7uAwOj88RBneek6tNu18iWh%2BEgBlNHR48i6eApeiIYh5NGxyhAFnQcuUyovPSDkaSmcQT9d2G07XTJJ%2B9ZcR33Dol3RFpMZDORUhSe4OnWteMefwMuskSTzcEQ0OxQ96Z3I4J5dBNn5CePJj6%2B3WvFQ3Szo5rySTf8dXhr7PQTXlg8%2FKmLWVCvqcVcOG0I5UjFyGPHEHKAk1C9HS8ZBUt79BOkAA6qbfR8jysSHhHEpfnQgBga8BXVoWiSKRWLlz9JRj%2F6A6dFHrSpwJo5RUumMOnA4sMGOqUBD1bA%2FKJ9AdQRpS5eazN2C93SQ%2FJVgp8wcgmD7SdN05rifePgALvep9JTVemuBBvXwjyjJB32fYSWT%2BYrfEvmo24i7zI72s%2BOZxG9UgjNV3FSE2l3s2bHrD67aMpXhNJfY65dVAgmuI%2BxJwFZd%2B57ONW0EET%2B8fm8Cz6TNOTM6aJ2TD5OgeApdnjx%2F%2Bu6OHmlFZ%2FDR8owjDG6W3pS2X6JaM%2FL3SN8&X-Amz-Signature=8164ce690cb2ccc3d0e9e840de0f2a9a629d0cc7cdfbf10b2c2d172d28f6a3f9&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    [bookmark](https://github.com/bluechanel/deploy_llm/tree/main)

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


## LLM、embedding、reranker分体部署

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
        - 
    /data/models:/models
    
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
        - 
    /data/models:/models
    
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

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/e1756aaa-6b65-4e54-a5fe-aa2bba18033b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466X3AIYBM6%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T080855Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJIMEYCIQCC%2B0b4jbAAuNGO2bLKcikSvMBSMgbBMmhyB6I9UQFz2AIhAJrLAH5bAWiW4IG6ssy%2FgnTchfi7fHI9q6uU095fyGBaKv8DCHAQABoMNjM3NDIzMTgzODA1IgxVR04nLM9rw%2BiPZEUq3AO1JuI6stJlrdsabGA9SodhGtmkzIcxzrpm20qxYTNKdmVV%2BiIc3jrbLOQVaGI3fNooeJpmRfKIur6NtnF2Wg6Y50F1JSaSD776pT2QeR4Fc9g4CaXek%2FZ0aVLHl9VLKPQNiDFqcSG3kmZcmWDph09R%2BoIk3qekRFlpTe4usyGSxtt8LrJUg72V5lKwNBQXqfdUbyGO93mO7DJKQ0kA7Z191K2amPM3Y%2FjJOi4ZmyJ1ZK%2B%2BXrRdcCslkaAAYkG02BmXNpjZ1dY36%2F6Z2OhSvXz1u3XEoogXvCxvqSsUHjy%2BexaFtBqrK9i7WnxeKCBoxrTcXBe2OqCYDg%2FIa5wTHwjBfr8AqN5wXkjQy%2FkWsQAcdbu4uGxzN34%2FfTaPtJAQBYfKbVJ0plKYG7ioiUNINX3eal5Zo5sHbq6Yv4zXMoTtqDl2efwMubBncveyRqWw4%2Bh1Dgq9vuOkY5HEcComqbXRCYiEDMAth1teOCYe9%2BfttWNPmusZU%2Bs9vC3moyky2r%2FB6CCRatDP0ywG1vzYpQ%2Fofi9n7bKRhRirAzLAxO29hAfgMIe78m7kj4hNzInrs7oqiDrqjn7v6vUjahXnxYaRk6htcAj3JEeFSzY9BdII9Ot6LacgebI86z4oODDyv%2BLDBjqkAfsusLSf9MFH1jOhJGKP3C9PPEHSCuUytSOqh2fbQT9Wzb6Hel5b6k1RfyeJyqZW4EeyaqT%2BSsmRHm%2BiBo5gbxhiMLPEp2%2BwoNcLxa%2F79LzpdEi0oq168khTgwBiyyQ3aYYNW9ugjETCtYRs5IzCjSBf6ciyBhPLo%2BPcfqgmJ5kdvfA0FHE4sHtLtPDnAJMKUGUh74XWu3WYDLvWEsSA%2BiMMbdax&X-Amz-Signature=38edf2f7463fbac1a69ebb9b9de2bedae3e496012a41d181ab5d8bf2a0bcd58b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**排错**


vllm启动可能会有如下报错，在docker compose中修改`shm_size`的值为错误提示的值，即可


![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/bae86682-7725-440f-a248-074de305b696/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466QJCPKEAC%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T080850Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIF0jQGS5Efs%2FelSl7lVpSAvITe3HbkX00qN4zukuKyytAiEAqiU80ho1AHKgXFcrkTRHcWwwWHcO73v3im9f35zjzeUq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDLe8Egn6kFWXzUSPtyrcA6tOBD6BAMmaJgCVj%2Bvm54qyxSXCTd9MBR9PFPk4RpeI5k7KfPbssT0zq9FnwaF38j8zS7lBWCtFJG3%2BYDYYqgdNCZXQ6MMWcUS%2FkJKyU4QWETtOF8SkKCKjgP8B0qSh6mQHVMYY2JFNeXPZoa1UuwBe0LjY9WpOcQ6DQ0IlsOyWiQ2fvn8eghKfWHKwIjBOdM6Hu7r5zHxEf0pjxYqr3Snl5RrHWnh26s%2FIAHx7peTLtakvAGCjk4d0qoz9F3Vlx5Wn777phmU2JQuX4ft8Bp7Bxte5ThDcaZ3MW6v3BLeqfBklaauLtLRlOgqtZBo16fF3nYB9DoQnRLdIiot0jYNxCtTWJbgFLiW0YuIynzR%2FPWyWpdlms9Av1mObovuE0kGciEx%2FmL61aYoItuhFz4B4YtdDuW0CCFvyv%2BrG3AUQk1a0vxuswbyPTTrc8i0W7ClPk75G6TXYY%2BS9PpU4WxMhA9DfP%2FTbSGX0lzQNrID%2FMZN%2Fp%2FEcJ2n5vO7nd9UX4UwoMl8py0mhvR1RS4HgWIB%2BQsv5IZtKDpp%2BRWUB4yTpaX7fT1m3RxRpVSV4jKQo9%2FHmDUtE74KzVVXc%2FNq3MKIK0bYifWfwVG1W6QdLiJvo4bKKJLZ11wbA732LML7A4sMGOqUBKW9V3%2F51SVeKmtblzVAsRqSGQqfP78BpGPtHCTGWGnfG6MHGN2s%2B%2FobV33qROpnO%2BMm32XryCEtD9VXXYT6o5gRxc94jG8RvNuiVS46YEr%2B8WExgbUeJQ0%2BBjgzZEZxp5777L0oR74%2BeEEyPM%2F1UTNFxD0CbG%2BZCGcKO%2BfZkNfHJHRRfbXAQFI2k7d3FLwmEzmViYRUjGzApf9FrFRebPxtxqCrz&X-Amz-Signature=d9659de7dee2d5545391ecfd0ca0599952aec8bc65c50070f92dd7a356391a98&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## 已废弃部署方法（20240918）

# 模型部署


当前开源的模型部署服务很多，主流的有[FastChat、](https://github.com/lm-sys/FastChat)[Xinference](https://github.com/xorbitsai/inference)、[ollama](https://github.com/ollama/ollama)、[vllm](https://github.com/vllm-project/vllm)、[lightllm](https://github.com/ModelTC/lightllm)，其中vllm，lightllm主要是用于**模型加速**。同时FastChat等也支持使用vllm启动模型获得高效加速，不过这些部署服务都**不支持工具调用**，也就是OpenAI 接口的tools参数。遂我对FastChat的代码做了部分修改，使其**支持tools参数。**具体代码见github，（仅测试了Qwen系列）


> 💡 由于不同模型训练数据不同，同样的Prompt在不同的模型中结果差异较大，导致tools能力不稳定，该能力未提交FastChat原始仓库。


[bookmark](https://github.com/bluechanel/FastChat/tree/main)


推荐的部署方案为：FastChat+vllm


## 方案1：docker部署(推荐)

1. 安装docker，国内使用[清华开源软件镜像站](https://mirror.tuna.tsinghua.edu.cn/help/docker-ce/)
2. [安装](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)[**NVIDIA Container Toolkit**](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)
3. 使用docker compose 部署，部署文件见下面的github地址

    [bookmark](https://github.com/bluechanel/deploy_llm/tree/main)


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
        - 
    /data/models:/models
    
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


    此版本Api接口使用的是支持**工具调用**的，如果不需要，请修改`docker-compose.yaml`文件中`fastchat-api-server`的启动命令为


    ```shell
    entrypoint: [ "python3", "-m", "fastchat.serve.openai_api_server", "--controller-address", "http://fastchat-controller:21001", "--host", "0.0.0.0", "--port", "8000" ]
    ```

4. 查看api文档`http://ip:1281/docs`

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/5813f5f8-9f74-497d-a7d3-ff6317a1e549/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB46662FQ6BII%2F20250717%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250717T080904Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEFcaCXVzLXdlc3QtMiJHMEUCIFcEjMHoIW%2B3mu6fCbH8NLOxe3tVbPgvxx9fJVuPQrHZAiEAyK07F3daamkY%2BRJxd9TTVV1qSWOjG9IIPVrIeqHbU3Mq%2FwMIcBAAGgw2Mzc0MjMxODM4MDUiDCfE1FsHd8Cr77R9dyrcA%2BWMsBD84qXtIHKyhPIGgLXPu3At6sKJx%2FoPsRc7hQ2gnZUjXRrB%2F9jSJk%2FApN%2FyRGMT6nrq3tbR1Yz3rArFraOFHBTPWEentiIAu4yzn3inB8OQMWmNviz2DsHlPBNKRIWYAcGVgmxyWEDQdUlXfUJ13QyQHWzG0GBj%2BZfN1BJWJVkKQvtDtG0RBrtmoUTgl2%2FOD6M4GW1nrWNk1RF%2FsX%2F1KLInYqJiNLAPj3Pf7wrWnMHakaWjGfOO%2FdOt6DpOjjCYD%2FJL3LrBDHw0DCnShc3U2o7w%2BTjIt5O8MfvjTbgvo2ysR3Y3hODFmXY5J28WFmjDTYsfn1WSmdpaKC1oojxJD0KrnuHsm1mnrPX4PW8RA5w5Naxv2k6bqCTn7gjBXRPyETCGMAw1b5HFPByf3cw3xwslJ%2BbRfyMfcDIxidVdt%2FLV37t8jhemmbm%2Fs2OQ034MPiC3orUr2WSWAhcevOYt%2FD25w%2FnMwOlVvFz9dqnYkZpYUnZJXoAtfbF%2BkE%2F1lY%2FsgQA9tqykvZQFn%2BeWw9N%2BzAQkq6DibgFgAirObrz%2BmeYqKSFRYDaBNDOgyB3QhQFBnpzdNHDHApEojY5NQ7oaQ7NhK%2BY%2BlfnwQW7gF1RLgA5mhHTLY0%2BL2gcfMLPA4sMGOqUBydhoj4lJsK2vXswhZtgL0rRIVNEWk2zM%2BWKyuETrVR6p18ellV8twu8xtdP%2FshvLBrCeVEtztaTdvmFVo7t%2F1rPtzFW0HdXc8z6OEvk9d97JcE3h93DUlRAo2UdR2VkYPYXmIwRyQN5qaCk5ulyExAjz0fWq%2FVrQhSo%2Ft8LIliqI8Iuz391Yb3OqDp2EfgG6RmTc4ytuY1bn1IsU7s%2FyJa%2FE3aLW&X-Amz-Signature=9190edb6f9adb02009159a7030e83f9bd2c1b014d2edb492784ee024d5d42d76&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


## 方案2：本地环境部署


使用fastchat加载模型（[支持模型](https://github.com/lm-sys/FastChat/blob/main/docs/model_support.md)），由于LLM都是由transformers开发，理论上fschat可以用于启动所有LLM


[link_preview](https://github.com/lm-sys/FastChat)


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


        `CUDA_HOME=/usr/local/cuda-11.8 python` [`setup.py`](http://setup.py/) `install`or`CUDA_HOME=/usr/local/cuda-11.8 pip install flash-attn --no-build-isolation`

