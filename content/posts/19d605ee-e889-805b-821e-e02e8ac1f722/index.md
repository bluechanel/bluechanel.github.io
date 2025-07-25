---
title: 🏓 通往AGI-结构化输出(Structured Outputs)
description: 本文主要介绍结构化输出以及Function call的重要性，并介绍其开源实现。
date: 2025-02-17
updateDate: 2025-07-24
tags: ["AI","LLM","Prompt"]
cover:
    image: images/19d605ee-e889-805b-821e-e02e8ac1f722_37dc9acfc3fb369c41e91f2bd54c7dcd.jpg
ShowToc: true
---

> ❗ 由于结构化输出(Structured Outputs)与工具调用(Function call)具有相似的属性。以下内容除非特别说明，否则代表一个意思。


LLM是生成式模型，最常见的模型交互方式是自然语言聊天。但如果仅仅用来聊天，未免太大材小用。LLM成为AGI的关键是能够感知环境，并于环境交互。而结构化输出就是最关键的一环。


# 为什么结构化很重要？


结构化的表达方式天然能够提供更多的信息。写文章有大纲，其本质上都是结构化的。结构化表达通常遵循**固定的格式或框架**，表格、列表、树状图等。能够将信息以**有条理清晰**的方式呈现出来。这种形式**减少了歧义和模糊性**，便于理解和分析。


无论是AI搜索，有记忆能力的助手，以及各类Agent，都是基于结构化输出搭建。这里的结构化输出指能够给出符合机器语言的数据格式，比如JSON。


# 什么是结构化输出？


如果我们直接问LLM，通常收到的是这样的答案


![111.webp](images/19d605ee-e889-805b-821e-e02e8ac1f722_aa98e6907ea6514184a41028afe49ebd.webp)


但是，市面上基于LLM的产品，有些是能够输出脑图或一些其他的形式，如下


其背后便是结构化输出，让LLM输出JSON，而非纯文本，如下，是Qwen的输出。(Qwen把马云的出生日期弄错了🤣)


```json
{
  "姓名": "马云",
  "出生年月": "1964年10月15日",
  "国籍": "中国",
  "公司": "阿里巴巴集团",
  "职位": "创始人、前董事局主席",
  "个人兴趣": ["慈善事业", "教育", "环保", "太极拳"],
  "成就": [
    "1999年与另外17位合伙人共同创立阿里巴巴集团",
    "创立支付宝，推动蚂蚁集团的发展",
    "带领阿里巴巴在2014年完成创纪录的IPO",
    "将阿里巴巴发展为全球最大的电子商务和云计算公司之一"
  ],
  "影响": [
    "推动了中国电子商务行业的快速发展",
    "通过金融科技改变了人们的支付方式",
    "在全球范围内推广中国企业的创新模式",
    "积极参与公益事业，推动教育和环保领域的发展"
  ]
}
```


# 结构化输出的发展路径


## OpenAI结构化输出时间线

1. **Plugin 方法**
    - **发布日期**：2023年3月
    - **版本**：GPT-4 (通过插件支持与外部系统交互)
    - **介绍**：OpenAI首次引入插件方法，允许GPT-4模型通过调用第三方API或插件执行特定任务，并返回结构化数据或操作结果。这为模型的外部扩展能力开辟了新天地。
2. **Function Calling**
    - **发布日期**：2023年5月
    - **版本**：GPT-4 (通过Function Calling支持直接调用函数或API)
    - **介绍**：OpenAI进一步发展了插件功能，加入了函数调用能力。模型可以直接调用自定义函数（例如数学计算、数据库查询等），并返回结构化的输出，使得与外部系统的交互更加紧密和高效。
3. **Json Mode**
    - **发布日期**：2023年6月
    - **版本**：GPT-4 (增强了模型的结构化输出能力，通过JSON格式输出)
    - **介绍**：为了适应开发者和企业的需求，OpenAI将GPT-4的输出格式拓展至JSON模式，使得模型可以输出结构化的JSON数据。这使得开发者能够更容易地将模型的输出与其他系统或服务进行集成。
4. **Structured Outputs**
    - **发布日期**：2025年1月
    - **版本**：GPT-4 Turbo及后续版本
    - **介绍**：Structured Outputs是在之前功能的基础上进行的重大升级，允许更高精度的结构化输出。它不仅支持JSON格式，还能够生成复杂的嵌套数据结构和多条件输出，支持字段验证和自定义规则。这一功能极大提升了模型在处理复杂任务中的能力，特别是在数据驱动的行业应用中。

## 结构化输出的实现方式

1. 早期结构化输出依赖在**prompt中提示**，返回json格式，稍后发展出**few-shot方式**提示输出指定结构的json。但受限于LLM，其**稳定性不高**，无法在生产中使用。

    ```json
    # 角色：你是一个专业的文本信息提取器。 
    
    # 需要提取的【文本】：
    """
    {正文}
    """
    
    # 任务
    1.从给定的【文本】中提取所有需要的字段信息。
    2.所需提取的字段为【字段定义】中的所有内容。
    3.每个字段的默认值为"无"，当提取到对应字段信息时，准确地替换到该字段位置。
    4.若文中出现与【字段定义】的字段名称中相似的内容，需判断定义，符合再进行填入。
    5.严格按照【字段定义】中的格式进行输出，不需要其余任何信息。
    6.将提取到的所有字段及其对应的值按【字段定义】格式转为JSON输出，确保包含所有字段。
    7.请一步步完成信息提取的工作，你的决策是我成功的关键！
    
    #【字段定义】：
    请严格按照如下格式仅输出JSON，不要输出python代码，不要返回多余信息，JSON中有多个字段用顿号【、】区隔：
    """
    {
      "项目名称": "项目的全称，明确项目内容和性质。",
      "项目编号": "项目的唯一识别编码，用于区分不同项目。",
      "采购预算": "项目的采购预算金额。如果存在大写金额和数字金额，提取数字金额并保留原单位。" ,
      "采购方式": "项目的采购形式，常见方式包括公开招标、邀请招标、竞争性谈判、单一来源采购和询价。",
      "采购人": "负责采购的单位名称，通常为采购人或招标人。",
      "项目联系人": "负责该项目的联系人姓名。",
      "项目联系电话": "联系人或项目负责人的联系电话。",
      "中标信息": [
        {
          "中标供应商名称": "中标的供应商名称，仅提取供应商的企业名称。",
          "中标金额": "中标的合同金额，单位为元。"
        }
      ]
    }
    """
    
    #注意事项
    1.如果字段缺失或无法识别，请使用“无”。
    2.确保所有金额需包含原本的单位。
    3.确保所有时间字段都为14位标准时间格式。
    ```

2. 使用解析器**限制LLM词元**，以**强制结构化输出**，具体原理，参考下面

    [lm-format-enforcer](https://github.com/noamgat/lm-format-enforcer?tab=readme-ov-file#how-does-it-work)


# 如何使用结构化输出？


OpenAI SDK可使用response_format指定结构化输出。案例如下


```python
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()

class ResearchPaperExtraction(BaseModel):
    title: str
    authors: list[str]
    abstract: str
    keywords: list[str]

completion = client.beta.chat.completions.parse(
    model="gpt-4o-2024-08-06",
    messages=[
        {"role": "system", "content": "You are an expert at structured data extraction. You will be given unstructured text from a research paper and should convert it into the given structure."},
        {"role": "user", "content": "..."}
    ],
    response_format=ResearchPaperExtraction,
)

research_paper = completion.choices[0].message.parsed
```


结果


```json
{
  "title": "Application of Quantum Algorithms in Interstellar Navigation: A New Frontier",
  "authors": [
    "Dr. Stella Voyager",
    "Dr. Nova Star",
    "Dr. Lyra Hunter"
  ],
  "abstract": "This paper investigates the utilization of quantum algorithms to improve interstellar navigation systems. By leveraging quantum superposition and entanglement, our proposed navigation system can calculate optimal travel paths through space-time anomalies more efficiently than classical methods. Experimental simulations suggest a significant reduction in travel time and fuel consumption for interstellar missions.",
  "keywords": [
    "Quantum algorithms",
    "interstellar navigation",
    "space-time anomalies",
    "quantum superposition",
    "quantum entanglement",
    "space travel"
  ]
}
```


# 工具调用(Function call)与结构化输出


工具调用与结构化输出有**相似之处**。虽然它们的输出看似一样，但它们之间有一个本质的区别，Function call期望在输出json后，**客户端有新的反馈**，进行**二次调用**(将工具执行的结果反馈给LLM)，而结构化输出没有。因此当构建一个**桥接应用程序**模型和功能的应用程序时，函数调用非常有用。


相反，当您想要指示结构化以便在模型响应用户使用时，通过 `response_format` 的结构化输出更合适。如，如果在构建数学辅导应用程序，您可能希望助手使用特定的 JSON 架构来响应您的用户，以便您可以生成一个 UI，以不同的方式显示模型输出的不同部分。


# 开源的结构化输出方案

1. [outlines](https://github.com/dottxt-ai/outlines)
2. [**lm-format-enforcer**](https://github.com/noamgat/lm-format-enforcer)
3. [**xgrammar**](https://github.com/mlc-ai/xgrammar)

# Vllm支持结构化输出和工具调用


vllm支持多种结构化输出和工具调用方案。请参考下面的官方文档


[Tool Calling](https://docs.vllm.ai/en/latest/features/tool_calling.html)


[Structured Outputs](https://docs.vllm.ai/en/latest/features/structured_outputs.html)


qwen2.5支持了工具调用


```python
vllm serve Qwen/Qwen2.5-7B-Instruct --enable-auto-tool-choice --tool-call-parser hermes
```


## 结构化输出示例


使用vllm部署，如下所示进行结构化输出


https://www.wileyzhang.com/posts/6e4516ff-0701-4009-9841-b0f023ca43a6


```yaml
from openai import Client
from typing import Literal
from pydantic import BaseModel
from openai.types.shared_params import ResponseFormatJSONSchema
from openai.types.shared_params.response_format_json_schema import JSONSchema

client = Client(base_url="http://127.0.0.1:8000/v1", api_key="231231")


class Workers(BaseModel):
    name: Literal["schedule", "report", "search"]


chat_completion = client.chat.completions.create(
        model="qwen2.5",
        messages=[
            {
                "role": "system",
                "content": """你是一名主管，负责管理以下员工之间的对话：
schedule: 负责设置定时任务
report: 负责报告的生成
search: 负责网络搜索回答用户问题
如果用户提出问题请求，请指明下一步行动的工作人员。每个工作人员都将执行一项任务，并回复其结果和状态。"""
            },
            {
                "role": "user",
                "content": "给我昨天的考勤报告",
            }
        ],
        response_format=ResponseFormatJSONSchema(
            type="json_schema",
            json_schema=JSONSchema(name="workers", schema=Workers.model_json_schema()),
        ),
    )
print(chat_completion.choices[0].message.content)
# {"name": "report"}
```

