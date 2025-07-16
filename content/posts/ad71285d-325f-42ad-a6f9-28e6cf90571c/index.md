---
title: 🔖 Prompt编写
description: 该文档是关于Prompt编写指南的，介绍了26种技巧与效果，以及进阶的CoT、类推提示法、PoT、ToT和GoT等方法，用于提升大模型的推理能力。
date: 2024-05-20
tags: ["LLM","Prompt"]
cover:
    image: images/ad71285d-325f-42ad-a6f9-28e6cf90571c_460eeddd1622745dca8c19c0491754b8.png
ShowToc: true
---

收集的一些有趣的Prompt


Awesome Prompts


# Prompt示例


一些LLM厂商提供的示例Prompt，供参考学习

- OpenAI Prompt

    [bookmark](https://platform.openai.com/docs/guides/prompt-engineering/six-strategies-for-getting-better-results)

- Claude Prompt

    [bookmark](https://docs.anthropic.com/zh-CN/prompt-library/library)

- LangHub Prompt

    [bookmark](https://smith.langchain.com/hub?organizationId=5b647e24-ca51-5aff-be4f-39ff2e8ce673)

- Raycast Prompt

    [bookmark](https://ray.so/prompts/raycast)

- ChatGLM Prompt

    [bookmark](https://open.bigmodel.cn/dev/howuse/prompt)

- Qwen Prompt

    [bookmark](https://help.aliyun.com/zh/model-studio/use-cases/prompt-best-practices)


> 💡 prompt的编写最好让大模型**输出整个过程**


在实际工程prompt中，有时只需要最终的结果，例如，让模型直接输出是否，计算结果等，这样会导致精度变低，一个有效的解决方案是，先让模型输出整个推理过程，再对输出做二次提示，以获取最终结果。


# Prompt优化


[link_to_page](https://wileyzhang.com/posts/42cf2440-733a-4073-a36f-2d5bee31eccd)


# Prompt 26种技巧

> 以下内容来自论文[https://arxiv.org/abs/2312.16171](https://arxiv.org/abs/2312.16171), 表格排名以论文中测试提升度和个人认为的使用难度从高到底
<details>
<summary>中文</summary>

| 原则 | 提示指令原则                                                                                                                                 | 排名 |
| -- | -------------------------------------------------------------------------------------------------------------------------------------- | -- |
| 1  | 如果你更喜欢简洁的回答，不需要对LLM过于客气，无需添加“请”、“如果你不介意”、“谢谢”、“我想要”等短语，直接说明你的需求。                                                                       | 16 |
| 2  | 在提示中注明预期的受众，例如，受众是该领域的专家。                                                                                                              | 1  |
| 3  | 将复杂的任务分解为一系列简单的提示，进行交互式对话。                                                                                                             | 3  |
| 4  | 使用肯定的指令，如“做”，避免使用负面的语言，如“不做”。                                                                                                          | 20 |
| 5  | 当你需要对某个话题、观点或任何信息进行清晰或深入的理解时，使用以下提示：
o 用简单的语言解释[插入具体话题]。
o 像我解释一样，就像我11岁。
o 像我解释一样，就像我是[领域]的初学者。
o 用简单的英语写下[文章/文本/段落]，就像你向一个5岁的孩子解释一样。 | 4  |
| 6  | 添加“我将为更好的解决方案付费$xxx！”                                                                                                                  | 5  |
| 7  | 实施以示例驱动的提示（使用少量提示）。                                                                                                                    | 19 |
| 8  | 在格式化你的提示时，以“###Instruction###”开始，然后根据情况添加“###Example###”
或“###Question###”。然后呈现你的内容。使用一个或多个换行符分隔指示、示例、问题、上下文和输入数据。                     | 10 |
| 9  | 加入以下短语：“你的任务是”和“你必须”。                                                                                                                  | 12 |
| 10 | 加入以下短语：“你将被惩罚”。                                                                                                                        | 13 |
| 11 | 在你的提示中使用短语“以自然、类人的方式回答问题”。                                                                                                             | 14 |
| 12 | 使用引导性词汇，比如写“逐步思考”。                                                                                                                     | 6  |
| 13 | 在你的提示中添加以下短语“确保你的回答无偏见并避免依赖刻板印象。”                                                                                                      | 7  |
| 14 | 让模型通过向你提问以获取精确的细节和要求，直到它有足够的信息提供所需的输出（例如，“从现在开始，我希望你能向我提问...”）。                                                                        | 26 |
| 15 | 如果你想询问关于某个特定话题或想法或任何信息，并且你想测试你的理解，你可以使用以下短语：“教我任何[定理/话题/规则名称]并在最后包含一个测试，在我回答后告诉我我的答案是否正确，而不提前给出答案。”                                    | 15 |
| 16 | 为大型语言模型指派角色。                                                                                                                           | 8  |
| 17 | 使用分隔符。                                                                                                                                 | 11 |
| 18 | 在提示中多次重复特定的词或短语。                                                                                                                       | 9  |
| 19 | 将链式思维（CoT）与少量提示结合使用。                                                                                                                   | 17 |
| 20 | 使用输出引导语，这涉及到用期望的输出的开头来结束你的提示。通过在你的提示的结束部分添加预期回答的开始部分来使用输出引导语。                                                                          | 21 |
| 21 | 写一篇详细的文章/文本/段落或任何需要详细的文本类型：“为我写一篇详细的[文章/文本/段落]，内容涉及[话题]，并添加所有必要的信息。”                                                                   | 18 |
| 22 | 对特定文本进行修正/更改而不改变其风格：“尝试修订用户发送的每个段落。你应该只改进用户的语法和词汇，确保它听起来自然。你应该保持原有的写作风格，确保正式的段落仍然正式。”                                                  | 22 |
| 23 | 当你有一个复杂的编码提示可能在不同的文件中：“从现在起，每当你生成跨越多个文件的代码时，生成一个[编程语言]脚本，可以运行以自动创建指定的文件或修改现有的文件以插入生成的代码。[你的问题]”。                                       | 23 |
| 24 | 当你想通过使用特定的词汇、短语或句子来开始或继续一段文本时，使用以下提示：
o 我为你提供了开始[歌词/故事/段落/文章...]：[插入歌词/词语/句子]。
根据提供的词语完成它。保持一致的流畅性。                                    | 24 |
| 25 | 明确声明模型必须遵循的要求，以关键词、规则、提示或指令的形式产生内容。                                                                                                    | 2  |
| 26 | 写任何文本，如一篇论文或段落，这些文本应与提供的样本相似，包括以下指示：
o 根据提供的段落[/标题/文本/文章/答案]使用相同的语言。                                                                   | 25 |


</details>

<details>
<summary>英文</summary>

| Principle | Prompt Principle for Instructions                                                                                                                                                                                                                                                                                                                                                  | rank |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 1         | If you prefer more concise answers, no need to be polite with LLM so there is no need to add phrases like
“please”, “if you don’t mind”, “thank you”, “I would like to”, etc., and get straight to the point.                                                                                                                                                                      | 16   |
| 2         | Integrate the intended audience in the prompt, e.g., the audience is an expert in the field.                                                                                                                                                                                                                                                                                       | 1    |
| 3         | Break down complex tasks into a sequence of simpler prompts in an interactive conversation.                                                                                                                                                                                                                                                                                        | 3    |
| 4         | Employ affirmative directives such as ‘do,’ while steering clear of negative language like ‘don’t’.                                                                                                                                                                                                                                                                                | 20   |
| 5         | When you need clarity or a deeper understanding of a topic, idea, or any piece of information, utilize the
following prompts:
o Explain [insert specific topic] in simple terms.
o Explain to me like I’m 11 years old.
o Explain to me as if I’m a beginner in [field].
o Write the [essay/text/paragraph] using simple English like you’re explaining something to a 5-year-old. | 4    |
| 6         | Add “I’m going to tip $xxx for a better solution!”                                                                                                                                                                                                                                                                                                                                 | 5    |
| 7         | Implement example-driven prompting (Use few-shot prompting).                                                                                                                                                                                                                                                                                                                       | 19   |
| 8         | When formatting your prompt, start with ‘###Instruction###’, followed by either ‘###Example###’
or ‘###Question###’ if relevant. Subsequently, present your content. Use one or more
line breaks to separate instructions, examples, questions, context, and input data.                                                                                                           | 10   |
| 9         | Incorporate the following phrases: “Your task is” and “You MUST”.                                                                                                                                                                                                                                                                                                                  | 12   |
| 10        | Incorporate the following phrases: “You will be penalized”.                                                                                                                                                                                                                                                                                                                        | 13   |
| 11        | Use the phrase ”Answer a question given in a natural, human-like manner” in your prompts.                                                                                                                                                                                                                                                                                          | 14   |
| 12        | Use leading words like writing “think step by step”.                                                                                                                                                                                                                                                                                                                               | 6    |
| 13        | Add to your prompt the following phrase “Ensure that your answer is unbiased and avoids relying on stereotypes.”                                                                                                                                                                                                                                                                   | 7    |
| 14        | Allow the model to elicit precise details and requirements from you by asking you questions until he has
enough information to provide the needed output (for example, “From now on, I would like you to ask me
questions to ...”).                                                                                                                                                | 26   |
| 15        | To inquire about a specific topic or idea or any information and you want to test your understanding, you can use
the following phrase: “Teach me any [theorem/topic/rule name] and include a test at the end, and let me know if
my answers are correct after I respond, without providing the answers beforehand.”                                                               | 15   |
| 16        | Assign a role to the large language models.                                                                                                                                                                                                                                                                                                                                        | 8    |
| 17        | Use Delimiters.                                                                                                                                                                                                                                                                                                                                                                    | 11   |
| 18        | Repeat a specific word or phrase multiple times within a prompt                                                                                                                                                                                                                                                                                                                    | 9    |
| 19        | Combine Chain-of-thought (CoT) with few-Shot prompts.                                                                                                                                                                                                                                                                                                                              | 17   |
| 20        | Use output primers, which involve concluding your prompt with the beginning of the desired output. Utilize output
primers by ending your prompt with the start of the anticipated response.                                                                                                                                                                                        | 21   |
| 21        | To write an essay /text /paragraph /article or any type of text that should be detailed: “Write a detailed [essay/text
/paragraph] for me on [topic] in detail by adding all the information necessary”.                                                                                                                                                                           | 18   |
| 22        | To correct/change specific text without changing its style: “Try to revise every paragraph sent by users. You should
only improve the user’s grammar and vocabulary and make sure it sounds natural. You should maintain the original
writing style, ensuring that a formal paragraph remains formal.”                                                                             | 22   |
| 23        | When you have a complex coding prompt that may be in different files: “From now and on whenever you generate
code that spans more than one file, generate a [programming language ] script that can be run to automatically
create the specified files or make changes to existing files to insert the generated code. [your question]”.                                           | 23   |
| 24        | When you want to initiate or continue a text using specific words, phrases, or sentences, utilize the following
prompt:
o I’m providing you with the beginning [song lyrics/story/paragraph/essay...]: [Insert lyrics/words/sentence].
Finish it based on the words provided. Keep the flow consistent.                                                                            | 24   |
| 25        | Clearly state the requirements that the model must follow in order to produce content,
in the form of the keywords, regulations, hint, or instructions                                                                                                                                                                                                                             | 2    |
| 26        | To write any text, such as an essay or paragraph, that is intended to be similar to a provided sample, include the
following instructions:
o Use the same language based on the provided paragraph[/title/text /essay/answer].                                                                                                                                                     | 25   |


</details>


# 进阶(主要用于提升大模型的推理能力)


## CoT


CoT的全称为Chain of Thought，译为思维链

1. 0-shot CoT

    在prompt中给出问题的解答步骤


    示例：


    ```python
    请按照以下步骤来计算：
    1、先计算任意两个相邻顶点的距离作为正方形边长
    2、计算边长的平方得到正方形面积
    ```

2. few-shot CoT

    示例：


    ```python
    问：这里有一个正方形，它的四个顶点分别是 (0, 0)，(1, 1)，(0, 1) 和 (1, 0)，求这个正方形的面积是多少？
    答：我们从中选择两个相邻顶点，比如 (0, 0) 和 (1, 1)，计算它们的距离得到边长为1，然后对边长计算平方得到面积为1。
    问：有一个正方形，它的四个顶点分别是 (-2, 2)，(2, -2)，(-2, -6) 和 (-6, -2)，求这个正方形的面积是多少？
    ```


在较为常见的问题中，只需要在prompt的后面加上一句 ”think step by step“，”一步一步思考“，就能够显著提升结果的准确度


### 类推提示法


原论文[https://arxiv.org/pdf/2310.01714.pdf](https://arxiv.org/pdf/2310.01714.pdf)


类推提示法是在CoT基础上的延伸，CoT面临的问题就是在大规模的推理中，人力提供思考步骤以及示例是不现实的。那么我们在大模型在拿到问题之后，先生成若干个与该问题相关的例子，然后把这些例子当作few-shot，生成CoT，再一步步解决问题。


基本结构如下：


```python
初始问题：\<原始问题\>
相关问题：回想三个相关而独特的问题，并对每个问题及其解决方案进行描述。
解决初始问题：
```


示例（原始论文示例翻译）：


```python
你的任务是解数学题。当遇到一道数学题时，请你先回想一些相关的题目作为例子。然后，再去解决最开始的那个问题。
# 最开始的问题：
有一家航空公司为飞机上的每位乘客提供晚餐，乘客可以选择牛排或者鱼。六名机组人员中有三人可以选择牛排，三人可以选择鱼。如果食物是随机分配的，那么两名飞行员都拿到鱼的概率是多少呢？
# 操作指南：
你的答案中必须包含以下几点：
## 相关问题：
请你想出三个和最开始的问题相关的数学问题作为例子。注意，每个问题都应该和其它问题有所区别，包括和最开始的问题（比如，涉及不同的数字和名字）。每个问题都要按照以下的格式：
- “Q：” 后面写问题描述
- “A：” 后面写问题的解决方法，并把最终答案写在 \boxed 里。
## 解决最开始的问题：
说：“我们来解决下面这道数学题。” 然后按照以下的格式回答：
Q：把最开始的问题复制粘贴在这里。
A：解释解决方案，并把最终答案写在 \boxepd 里。
```


## PoT


[论文](https://arxiv.org/abs/2211.12588)


PoT的全称为Program of Thought，译为思维程序。


对于计算类型的问题，让大模型生成代码在解释器中执行，可以显著提升推理能力。论文显示在数学和金融方面推理能力提升12%。


示例prompt（来自论文）


```rust
# 问题： 图卢兹的绵羊数是查尔斯顿的两倍，查尔斯顿的绵羊数是西雅图的 4 倍。如果西雅图有 20 只羊，图卢兹、查尔斯顿和西雅图一共有多少只羊？
# 通过执行 solve() 函数来回答这个问题。
def solver()： 
  # 让我们逐步编写一个 Python 程序，然后返回答案
  # 首先，我们需要定义以下变量：
```


```rust
Seattle=20
Charleston=Seattle*4
Toulouse=Charleston*2
# Then,we need tocalculate the sum of the three
sum=Seattle+Charleston+Toulouse
# Finally,we need toreturn the answer
return sum
```


## ToT


[论文](https://arxiv.org/abs/2305.10601)


示例prompt请参考官方[github](https://github.com/princeton-nlp/tree-of-thought-llm/tree/master)


## GoT


[论文](https://arxiv.org/abs/2308.09687)


涉及到多个Prompt步骤，示例请参考官方[github](https://github.com/spcl/graph-of-thoughts/tree/main)

