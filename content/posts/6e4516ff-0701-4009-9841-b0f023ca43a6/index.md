---
title: 🚢 LLM部署(docker+vllm+embedding+rerank) 支持工具调用
description: 该文档介绍了关于LLM模型部署的内容，包括模型选择、模型下载、模型部署方案以及模型使用和加速方法。推荐的部署方案是使用docker部署，同时提供了本地环境部署的方法。模型加速方面介绍了vllm和flash-attention两种方法。embdding模型，rerank模型
date: 2024-06-03
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

    ![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/94c1b3e8-aeeb-4fdb-adf5-fedb3bad4f75/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TSW5CKVI%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073659Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIAawL%2Fokd9ieBWRigeWNBzkigjvT6Yo1iucZzpbJv7lFAiAJJOp8s3swi9CuDMjjYuoTsA0EfQZ8uIbmH95S1lSRKSr%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIM6jb8jktiT60iH2o1KtwDygclYRvGv1LnCD%2BQrUuwi62UAe8kb27g6iNr6HLeW1duoIhKp5qxMpHzUSziz%2FOcUpRIoH5V1DiII6CwlZ30nk9k47ZUDYWW%2FNVGC5YgrkoFK8Z%2FVpIL0CTVXMPoT%2BnVCe0hfzIw%2B8bM4hHTZeMJjAi93gkkYbqRGw95TyLuo4DihtX6GQiLyXzx5Mll6x3ZE73JRFfFQn9SYq2li72wK81Z3nRs%2B3jYG4Khv8prdTx8Rw%2B6gL9o3Qnz3E4OGHxa7KbhnzdkflCfKElNVDKI9k07gqZ2xhHkb%2FqtAhfav8jmx%2B5zvFm7nkx%2BhVlssiKumoKK%2BbpUjgPEzJNd8JFEutoNtzVhPxqAK9AbOtI1icWNZ5r%2BKqRqQiaM8fUsMkxv%2F94h5x0pCPdHwe2SIlEPxwGKdsnJWRX8BKjhpL0qJxTRrPbUXFp67Nt4SBGxYQrkGGA1tFGxC8%2FAATF9XdXehmn3Eupy722knFYeNcPn%2F5vwTez6iqbx1pBqZ%2BPJ8WP8a80zttTIRfqO7%2BPBxuiEXg9uz3blEPcfmdFpS80Ei7mHTo31zyb6R0e56iiEHr3f8NcFk%2BUhb8GykAHHEO5QXP22M5AAKSOjQd6UraXVwwr%2BNwhOmNTQO0BlToUw8dzSwwY6pgG9OwLf%2FgyBqFm%2F7viZiwCmALBP6y7ZeID5r%2FX9hUzfCKmnKjPuuIQAZJFnEHTykJdaLJ%2FN70sdTY0aAv9HhkEBpH8PEd2kZ5GbKwXz%2BmKBihdyRr3wU81khSwYB0ncMH997HyfY5ne8kIbGOaCKRyWwkWzykU%2BsScV0K5RyoAjlvZ9kEfNwMrToT2SmArEP6ymuDpG0frPBVuCZL00w4Rkkq%2F1sZup&X-Amz-Signature=4bf522dc1ec5a5bfc3d3fb4c8b33234a1db500b43422e57684085080ff13c556&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)

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

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/e1756aaa-6b65-4e54-a5fe-aa2bba18033b/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466XWGB2K7N%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073710Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCIQDG7SJaD%2FAqnQ8wq05oov8oubDG13xT3jEX84l9JO2EqAIgLFwv0xLNBUyJOyjORUKgpz1bacC17UzAo5iLHvRbiQAq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDNXFEYz%2Bp5VZD3x3dSrcA0uKRF4FZrGBq8we3EafNsRgEvW5zPRvwF4rQ9EZ9A%2FdiQ3gvKghHaO5DCOT%2FsizqkYkcjiiAPfbQpy%2FymM00fntC8wXM12Lnjp91q9FSW9EFuUytF24F9IxeqHMbRwntDElMmQRmNA%2BSa0R5tfjf7edIt7z%2B6O71MTD2QdKyd1ETXUF32GK5X%2FgZgenRMyGaFI29qLHrU1snRpHvnsKj%2BnE7tY5qGX7ecUqcCaUrS5ulb4rfExGtXYJG9DZmME3U6QvnOlSPO%2F%2BLTxLcSBIWHuzLTUCAeYYCwmTIZfTJafUFgB0rSO%2F7f8G52qpgRKOdYC19Xio2pMvgjVk%2FzeQ%2FhcNtPaxwUdrJCfMdAaWZQy2JBP8OSbH%2FzXsgu5xiBL0RZg1%2FOGQ2YpIeZW%2BAtVujoBqy29KNjedPQk0llSbtr%2FWVw3Y9QhNYEjLsB7UIz9ZOPku%2BhUNhqeyUWsILhw4%2BnVFtqi27xlg9iJQm9ug4iONR5Jcf2wxEsG73jAemNo78vY8gcIY9t4uw7lT5EP52t%2FgB%2FxcsvFDbD7%2FvsjWRZ8vTUhcqzH9ne896bsJyRWZBsha4tbRW0x%2FHy6wwGrjudlEMNnRep1H%2BKWheFjFlPqwdD4DItoOGDJLsnSLMPXc0sMGOqUB2yo46x4nBLs5wADeUqZ%2F0djvqUvk%2FO5TSDqQPxLZNIQMuDteErd7POUttXhD0yUSFhBmsbPHGP1nntIUh8tzYYX4V7U7Uy1r4aEykJ8GkfTknA%2Fob5zwmf25yNRYPsSaky%2F%2BFamwAbwqXjz5iMVbHhaSgj7jYyo54HQYr3FJxv57uL%2BWsbFBHdvsSB5nN2Vyqn34ccWVYPp0K8beAfjDDrPh2yZl&X-Amz-Signature=7102663ebfbee81eb22bc196cafab9d4d79e86ec5b6771b08abf1f62f658a8f1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


**排错**


vllm启动可能会有如下报错，在docker compose中修改`shm_size`的值为错误提示的值，即可


![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/bae86682-7725-440f-a248-074de305b696/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TX7BR6FE%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073708Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJGMEQCIF7GJpFsT3ftRA5pPdQ4pliGRLpkYEyCc5xkTndNvhyCAiAd2QKU%2B2FoxSz8K%2B6wrjo%2FbLqBHTdu2vwSnJrEhh6sJyr%2FAwgoEAAaDDYzNzQyMzE4MzgwNSIMuVA4nfPHr1gTXrKLKtwDzxG4Xcpeg7OADlvlj%2FYFosWcHhBCDTXirniCH52YWn7z2TKuxWyTOPJmOxWuvRstA4KQi12kszXeqpoj5miGzlUbhZdPatF6QPHt1V65oWwtclqb9iAmst0dD246XwIrPu427UfFIJuq3QmGGwQX%2FK0viyy0ISRnaNu%2BADlF7WMitRY4Ypjl%2BFM78Vq7bSssefGpyLEjcq2mx2I5jCRVcGwmO1uba9tfhlisiRbeiG3%2Bi6ti4H1%2FEJbs7K1qWuNafg32V5ofAHsJ46hLA5jq%2B0gFig%2FeEIPmuftx0goCoPV8%2FYW0N2WpUk8iLm9bgflyGWVdgT8ZRGZQvpaIl%2FX8cSAuNf19obMsD5d9MrRe7WKDwz%2BgZWgDCiqJunfdaJt5q2IOKmYFwmfTw3QrmU3zazMQaUvLoLPvSb%2BJrI57RP57XZyszHal4lWljVGt%2FT3WUXxDWc15j1sjgmeh%2F4OQ9ZS5UfQkoxAjDSmJO225CvnRopgNX9BMdC4UduQi4EseuKKXZf2Frz%2FppzM9ekA%2FSupfRsmHWt8ANExAVih6VIuyTkIGEmflHgGsyOufXQ3S0oD7XkVCaaTtR7C%2F%2FrbSDMVI8%2FZARm7zgMsHRzAFt%2FkqHINtu9pjOUpfXvYwt9vSwwY6pgGJMjSn52qGwjJYT5YAF4Ai190cduKTE7l%2Bg8dKQEvieMjB%2BrEgyG%2FIsAWxr1HzV6MCfaZKMI9rl5kb%2Fv7gMQUyVjyoRfvUQki%2Banhz0vV75MwJAj%2BBDtkdCCugQ4SQ%2B3ZooBOH5RFhyLxVNE18kQwOYG%2B9j1RXXspUxbSDsirRiXrsno4kmXgwzflpVTJ2F3%2FCAeafvZPx7hvQCgxPMzltRT8%2F9ZMn&X-Amz-Signature=8c0e707f9feda7962dbced50753e6fe4fa22b8a1e6a04024b68bfae753d9255a&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

    ![Untitled.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/5813f5f8-9f74-497d-a7d3-ff6317a1e549/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466WCBVOIRN%2F20250714%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250714T073716Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEA8aCXVzLXdlc3QtMiJHMEUCIQClnq3Bk1S%2F97UPBjk1fDqwlGpz1res%2F67LuddFi85%2ByAIgZtTrWWo3uyJTZJRdDbBhk6TaKogKWBEReTshX%2Flf9PEq%2FwMIKBAAGgw2Mzc0MjMxODM4MDUiDEUZCu6voGESIhZRqCrcA7ppebPL5MNT8rhCyo2Mx%2B6IeWapcV6f0HrTOzdOrfQOFSVkYmNMpFoGJ%2FHoC1howxL8zFuf7bLl4AM17nL34YASIlu2MbQA5FqAgrMS2we89orgvgYOphMDpU8Z0sFbs6IUCfFZjEde4tDSeLJzXedPFzhBmb4QOsLs2I0veaDq%2B3jJXx8EQa%2FENo24YMpOU2f5KMOb5%2Bp8inHY1ZWSt91PQpkff0Y9oiMRQqp9%2FVMZrlDMAybK8XflmWx%2BN5kqWtjCuNl3XZgpX9dzwgN2EHf136zkq712Ji4fZcPuKi44LYQgVbOwAubkW0BlQM2orC29ZE9TIQ5RexnYJ%2FhKgoJxEaTJA4Yeny0NvLv8soePEAd2sMbN3aN%2BoKfgUWBnKseCeGnKCIoPLwFZnlrej0g1oKlrBwkIZysDwDykDX3vIy%2BKaRl1dAiSCqxJqclYtukClUp2bRdI%2BFHc53IOkH%2Bm%2BKtPVtj91xPiqPVgtVYlRut8masaymBEKaYURDCRhZXjaiNUZx0k9p0Cr2%2FSxQgxQUx9LoclKXBYgsFv3EltWw7mhJFKRbPGX3XltjWABb8m3bJiCBBp5%2BfmO19Yfjh%2BfDi7AKgY5ej5JBUBWFk0QJMacqDqOBkienaaMK7c0sMGOqUBaHgVJ6LSmcGGg66dHbQoemFqgBOJgLts7fojb8or%2BVlNMgttFsjB31tfH9sReexS%2FLrqW%2FTSGF4dY5N9nco0N4yGlxbUoPZPVDnVnee4zxy%2FESXWOUkzVuoDucOwRk7JdD4%2BSS2lVTjOTHbEldCJ7JPC8Q%2BYmtS3IOvCpiZX83mG7dfA63qBJu98Fy%2B%2BF5o2oKYWE58kIWn3F4aXGFLf2TI7aAKF&X-Amz-Signature=bcea2e0c014fe23447e8e028bbd2deedd97a881bc00177fc6b697457460f2e13&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


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

