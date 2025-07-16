---
title: 🚥 如何选择大模型(榜单+指标)
description: 在选择大模型之前，需要明确自己对语言、通识、推理、数学、代码、长文本和工具等七大能力的偏好。评测指标包括MMLU、C Eval、ARC-C、BBH、GSM8K、MBPP、Human Eval、L-Eval和T-Eval。常用榜单包括OpenCompass司南榜单、Huggingface榜单和MTEB榜单。
date: 2024-06-03
tags: ['LLM']
cover:
    image: images/4ab81ed7-7622-4ef1-9fc6-1e1ae4edbd99_77ff0447ba6e77705bd22a0d0b8826c0.png
ShowToc: true
---

模型选择前明确自己需要的能力偏好，一般有分为 语言、通识、推理、数学、代码、长文本、（工具）七大能力。这七大能力分别对应多个评测数据集


# 评测指标

1. 语言
    - **MMLU** - 针对大模型的语言理解能力的测评，是目前最著名的大模型语义理解测评之一，任务涵盖的知识很广泛，语言是英文，用以评测大模型基本的知识覆盖范围和理解能力
    - **C Eval** - C-Eval 是一个全面的中文基础模型评估套件。它包含了13948个多项选择题，涵盖了52个不同的学科和四个难度级别。用以评测大模型中文理解能力
2. 通识
    - **ARC-C** 它是 ARC 数据集的一个子集，ARC 数据集是一个需要推理和常识性知识才能回答的大规模选择题集合。ARC-c 数据集包含 10,457 个问题，这些问题比原始 ARC 数据集中的问题更难、更多样，而且无法用简单的检索或词语联想方法来回答
3. 推理
    - **BBH** - BIG-Bench Hard (BBH) 是一个大语言模型测试集合。BBH 从 BIG-Bench 中提取了 23 个有挑战性的任务，当时的语言模型在这些任务上没有超过人类的表现
4. 数学
    - **GSM8K** - OpenAI发布的大模型数学推理能力评测基准，涵盖了8500个中学水平的高质量数学题数据集。数据集比之前的数学文字题数据集规模更大，语言更具多样性，题目也更具挑战性
5. 代码
    - **MBPP** - MBPP（Mostly Basic Programming Problems）是一个数据集，主要包含了974个短小的Python函数问题，由谷歌在2021年推出，这些问题主要是为初级程序员设计的。数据集还包含了这些程序的文本描述和用于检查功能正确性的测试用例。 结果通过pass@k表示，其中k表示模型一次性生成多少种不同的答案中，至少包含1个正确的结果。例如Pass@1就是只生成一个答案，准确的比例。如果是Pass@10表示一次性生成10个答案其中至少有一个准确的比例。目前，收集的包含Pass@1、Pass@10和Pass@100
    - **Human Eval** - 用于评估代码生成模型性能的数据集，由OpenAI在2021年推出。这个数据集包含164个手工编写的编程问题，每个问题都包括一个函数签名、文档字符串（docstring）、函数体以及几个单元测试。这些问题涵盖了语言理解、推理、算法和简单数学等方面。这些问题的难度也各不相同，有些甚至与简单的软件面试问题相当。 这个数据集的一个重要特点是，它不仅仅依赖于代码的语法正确性，还依赖于功能正确性。生成的代码需要通过所有相关的单元测试才能被认为是正确的。这种方法更接近于实际编程任务，结果通过pass@k表示，其中k表示模型一次性生成多少种不同的答案中，至少包含1个正确的结果。例如Pass@1就是只生成一个答案，准确的比例。如果是Pass@10表示一次性生成10个答案其中至少有一个准确的比例。目前，收集的包含Pass@1、Pass@10和Pass@100
6. 长文本
    - **L-Eval** -  L-Eval 是一个全面的长上下文语言模型（LCLMs）评估套件，包含 20 个子任务、508 个长文档，以及超过 2,000 个人工标注的查询-回复对，涵盖了多样的问题风格、领域和输入长度（3k ~ 200k 个 token）
7. 工具
    - **T-Eval -** T-Eval 旨在逐步评估工具使用能力。T-Eval 将工具使用评估分解为沿模型能力的几个子领域，有助于全面和孤立地理解大型语言模型（LLMs）的能力

> 💡 以上都是客观测评，而为了更好的体验，还有主观测评，也就是将问题提交两个匿名模型同时响应，多轮对话后，最终由用户确认，哪个模型的体验更优秀


# 常用榜单


## API榜单


包括价格、输出速度、延迟、上下文窗口等


[bookmark](https://artificialanalysis.ai/leaderboards/providers)


## 司南榜单（主观+客观）


[bookmark](https://rank.opencompass.org.cn/home)


## Huggingface榜单


开源榜单


[bookmark](https://huggingface.co/spaces/HuggingFaceH4/open_llm_leaderboard)


闭源榜单


[bookmark](https://huggingface.co/spaces/lmsys/chatbot-arena-leaderboard)


embedding榜单


[bookmark](https://huggingface.co/spaces/mteb/leaderboard)


## 大模型情商(EQ)榜单


[bookmark](https://eqbench.com/)

