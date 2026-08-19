---
title: 使用DSPy 自动优化Prompt
pageId: 42cf2440-733a-4073-a36f-2d5bee31eccd
description: 
date: 2024-07-29
updateDate: 2024-12-03
tags: []
cover: cover/42cf2440-733a-4073-a36f-2d5bee31eccd_8e01ca191a7afeb6775cdb1a0b1b5c95.png
---

# 介绍

[DSPy](https://github.com/stanfordnlp/dspy) ，旨在系统优化语言模型（LM）的提示词和权重，以提高复杂任务的性能。它将程序流程与参数分离，并引入了** LM 驱动**的优化器，基于特定**指标**{% mark color="red" %}**优化提示词**{% /mark %}和权重。这种方法使得使用 语言模型更高效可靠，减少手动调整提示词的需要。DSPy 还支持模块化编程，提供通用模块和优化器，类似于 PyTorch 处理神经网络的方式。

简单来说就是DSPy基于给定的**目标**和**约束条件，**自动优化中间过程，也就是Prompt。

## **签名Signatures**

DSPy中签名的表现形式是Python函数**注释**，是未经过优化的**Prompt，**后续可使用优化后的Prompt替换

## **模块Modules**

模块指的是 DSPy 中的功能组件或功能块。这些模块负责实现特定的功能，用户可以根据需要组合和使用这些模块来完成各种任务。

## **数据Data**

测试集和训练集

## **指标Metrics**

用于衡量prompt的指标，下面是两个官方内置匹配

1. `dspy.evaluate.metrics.answer_exact_match`

2.  `dspy.evaluate.metrics.answer_passage_match`

## **优化器Optimizers**

优化器是用于**改进提示词性能**的工具。它通过调整和优化提示词的**结构**和**内容**，帮助用户得到更高质量的生成结果。

1. **`LabeledFewShot`**：仅从提供的标记输入和输出数据点构建少量示例（演示）。需要 `k`（提示的示例数）和 `trainset` 从中随机选择 `k` 个示例。

2. **`BootstrapFewShot`**：为程序（默认为您的程序）的每个阶段生成完整的演示，并在 `trainset` 中标记示例。参数包括 `max_labeled_demos`（从`trainset`  随机选择的演示数量）和 `max_bootstrapped_demos`（程序生成的附加示例的数量）。引导过程使用指标来验证演示，仅包括那些在“编译”提示符中传递指标的演示。

3. **`BootstrapFewShotWithRandomSearch`**：对生成的演示进行随机搜索，多次用 `BootstrapFewShot`，并在优化中选择最佳程序。

4. **`BootstrapFewShotWithOptuna`**：在测试集中应用 `BootstrapFewShot` 和 Optuna 优化，运行试验以最大化评估指标并选择最佳演示。

5. **`KNNFewShot`**。使用 `k-Nearest Neighbors` 算法查找给定输入样本的最近训练样本演示。然后，这些最近邻演示被用作 `BootstrapFewShot `优化过程的训练集。。

6. **`COPRO：`**为每个步骤生成和优化新指令，并通过坐标上升（使用指标函数和`trainset` 进行`hill-climbing`）对其进行优化。

7. **`MIPRO：`**在每个步骤中生成**指令**和**少量样本**。指令生成具有数据感知和演示感知能力。使用贝叶斯优化在模块中的生成指令/演示空间中进行有效搜索。

8. **`BootstrapFinetune`**：基于提示的 DSPy 程序提炼为权重更新（对于较小的 LM）。输出是一个 DSPy 程序，具有相同的步骤，但每个步骤都由微调模型执行，而不是由提示的 LM 执行。

9. **`Ensemble`**：集成一组 DSPy 程序，并使用完整集或将子集随机采样到单个程序中。

# 使用示例

1. 创建dspy配置

```python
import os
BASE_URL = "https://api.lingyiwanwu.com/v1"
BASE_KEY = "xxxxxxxxxxxxxxxxxx"
MODEL_NAME = "yi-spark"
# 使用 01 万物进行prompt优化
os.environ["OPENAI_API_KEY"] = BASE_KEY
os.environ["OPENAI_BASE_URL"] = BASE_URL
# 初始化dspy
llm = dspy.OpenAI(model=MODEL_NAME, max_tokens=5000,
model_type="chat")
dspy.settings.configure(lm=llm)
```

2. 创建数据集

```python
from dspy.datasets.gsm8k import GSM8K, gsm8k_metric
gsm8k = GSM8K()
trainset, devset = gsm8k.train[:10], gsm8k.dev[:10]
```

3. 创建函数签名

```python
class Intention(dspy.Signature):
"""
占位
"""
question = dspy.InputField(desc="用户问题")
intention = dspy.OutputField(desc=f"Up/Down/Lift/Right/Other 之一")
```

4. 创建模块

```python
# 使用COT
class CoTPipeline(dspy.Module):
def __init__(self):
super().__init__()

self.signature = Intention
self.predictor = dspy.ChainOfThought(self.signature)

def forward(self, question):
result = self.predictor(question=question)
return dspy.Prediction(
intention=result.intention,
reasoning=result.rationale
)
```

5. 创建指标

```python
def validate_category(example, pred, trace=None) -> bool:
return example.category.lower() == pred.category.lower()
```

6. 创建评估

```python
evaluate = Evaluate(devset=devset , metric=validate_category, num_threads=5, display_progress=True,
display_table=False)

cot_baseline = CoTPipeline()

devset_with_input = [dspy.Example({"question": r["question"], "category": r["category"]}).with_inputs("question") for r
in test_set]
evaluate(cot_baseline, devset=devset_with_input)
```

7. 创建优化器

```python
teleprompter = COPRO(
prompt_model=llm,
metric=validate_answer,
breadth=3,
verbose=True,
)

kwargs = dict(num_threads=3, display_progress=True,
display_table=0)

compiled_prompt_opt = teleprompter.compile(cot_baseline, trainset=test_data, eval_kwargs=kwargs)
```

# 使用langwatch观察

![image.png](images/42cf2440-733a-4073-a36f-2d5bee31eccd/42cf2440-733a-4073-a36f-2d5bee31eccd_7a0a9c0fdacf84dcadc6f1c65bcfc9c8.png)
