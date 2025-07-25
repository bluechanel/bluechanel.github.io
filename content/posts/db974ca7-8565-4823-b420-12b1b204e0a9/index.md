---
title: 💨 Airflow使用
description: Airflow使用心得
date: 2022-11-11
updateDate: 2025-06-18
tags: ["Airflow"]
cover:
    image: images/db974ca7-8565-4823-b420-12b1b204e0a9_31579b03304f53c80a36a74248f5b752.jpg
ShowToc: true
---

# 安装airflow


## 普通方式


> 💡 注意：airflow2+需要mysql 版本在5.7以上

1. 安装

    ```shell
    pip install apache-airflow
    ```

2. 执行airflow生成初始配置文件，默认在/root/airflow/airflow.cfg，轻度使用修改以下配置即可

    ```shell
    # 修改sql连接，数据库需要提前创建
    [database]
    sql_alchemy_conn = mysql+pymysql://root:xxxxx@172.16.254.98/airflow_db
    # 开启密码登录
    [webserver]
    authenticate = True
    auth_backend = airflow.contrib.auth.backends.password_auth
    # 修改执行方式
    [core]
    executor = LocalExecutor
    ```

3. 初始化数据库

    ```shell
    airflow init db
    ```

4. 创建初始用户

    ```shell
    airflow users create --username admin --firstname zhang --lastname wiley --role Admin --email xxxx@xxx.com
    # 后面需要输入两次密码
    ```

5. 启动airflow web 端和调度器

    ```shell
    airflow webserver -D
    airflow scheduler -D
    ```


## Docker compose方式


官方docker-compose.yaml文件


[bookmark](https://airflow.apache.org/docs/apache-airflow/2.8.0/docker-compose.yaml)

1. 修改配置

    大多数情况下，我们都需要安装自己的依赖在docker-compose.yaml文件的同级目录下,创建requirements.txt(写入自己需要的依赖)和Dockerfile文件


    Dockerfile文件模板如下


    ```python
    FROM apache/airflow:latest
    ENV PYTHONOPTIMIZE=1
    ADD requirements.txt .
    RUN --mount=type=cache,target=/root/.cache/pip \
        --mount=type=bind,source=requirements.txt,target=requirements.txt \
        pip install apache-airflow==${AIRFLOW_VERSION} -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
    ```


    修改docker-compose.yaml文件，取消`build .`的注释


    ```python
    x-airflow-common:
      &airflow-common
      build: .
      environment:
        &airflow-common-env
        AIRFLOW__CORE__EXECUTOR: CeleryExecutor
    ....
    ```

2. 创建文件夹，并生成airflow用户id

    ```python
    mkdir -p ./dags ./logs ./plugins ./config
    echo -e "AIRFLOW_UID=$(id -u)" > .env
    ```

3. 初始化并启动

    执行`docker compose up airflow-init`初始化数据库等


    执行`docker compose up`构建并启动容器，运行结束后使用`docker compose ps`查看容器情况


    ![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_1e68d4e550edde7416309b0c1ba2e152.png)


> 💡 每次增加依赖后需要重新执行`docker compose up --build -d`


# 创建第一个程序


安装完airflow后可以看到很多的示例程序，可以学习


# 在dags中使用自定义模块


在dags下创建python模块(带有__init__.py的文件夹)


```shell
<DIRECTORY ON PYTHONPATH>
| -- my_company
              | __init__.py
              | common_package
              |              |  __init__.py
              |              | common_module.py
              |              | subpackage
              |                         | __init__.py
              |                         | subpackaged_util_module.py
              |
              | my_custom_dags
                              | __init__.py
                              | my_dag1.py
                              | my_dag2.py
                              | base_dag.py
```


在my_dag1.py中使用绝对引用


```python
from my_company.common_package.common_module import SomeClass
from my_company.common_package.subpackage.subpackaged_util_module import AnotherClass
from my_company.my_custom_dags.base_dag import BaseDag
```


# 创建mysql公共连接

1. 先安装mysql插件`pip install apache-airflow-providers-mysql`
2. 如下方式配置

![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_7e5fae05a72ecc175ec46ba5b699dce0.png)


### 问题

1. 安装`pip install apache-airflow-providers-mysql`时报错`OSError: mysql_config not found`

    ```python
    yum install -y gcc python3-devel mysql-devel
    ```

2. 默认使用的数据库连接包是MysqlDB(mysqlclient)，该包在查询数据时报错`description:Failed to convert character set’`由于我使用的mysql为二开版本，所以没找到相关错误原因，后改用`mysql-connector-python`正常使用

    在airflow配置数据库链接的地方添加配置如下


![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_8386b919c0ef00dc62de75380c7145e3.png)


# DAG任务配置


```shell
with DAG(
        ...
        # 该配置默认为true，假如配置的开始时间为2022-09-10，而正式开始运行dag的日期是2022-09-14，那么airflow会自动生成2022-09-10，2022-09-11，2022-09-12，2022-09-13号的运行任务并开始运行
        catchup=False,
				# 首次创建的任务暂停执行
				is_paused_upon_creation=True,
				# 配置任务超时
				dagrun_timeout=timedelta(hours=1),
				# 配置任务错误重试
				default_args = {
						# 为true则依赖前一项执行成功，可能会造成任务卡死
						"depends_on_past": True,
						# 重试次数
				    "retries": 1,
						# 重试间隔时间
				    "retry_delay": timedelta(minutes=3),
				}

) as dag:
	...
```


# Operator执行器


## 使用MysqlOperator


[mysql连接配置](/f5c1e14a145f46668b5e36057578f218#df6b9278b2ca42a68a5770ff633ba6ae)


```python
# -*- coding:utf-8 -*-
from datetime import timedelta

import pendulum
from airflow import DAG
from airflow.operators.empty import EmptyOperator
from airflow.providers.mysql.operators.mysql import MySqlOperator

default_args = {
    'owner': 'wiley',
    "retries": 1,
    "retry_delay": timedelta(minutes=3),
}

# [START instantiate_dag]
with DAG(
        dag_id='project_board',
        default_args=default_args,
				...
				# 注意配置此处的模板搜索绝对路径，否则会报错jinja2.exceptions.TemplateNotFound： xxxx
        template_searchpath=['/root/airflow/dags/']
) as dag:
    run_start = EmptyOperator(
        task_id='start',
    )
    dws_project = MySqlOperator(
        task_id='dws_project',
				# sql文件路径
        sql='dws/DWS_BOARD_PROJECT.sql',
				# airflow 
db连接

        mysql_conn_id='vernox_dw'
    )

    run_end = EmptyOperator(
        task_id='end'
    )

    run_start >> dws_project >> run_end
```


## 使用PythonOperator


```python
weekly = PythonOperator(
    task_id='ods_qingflow_weekly',
    python_callable=w.run,
		# 传递参数
    op_kwargs={
        'current_date': '{{ ds }}'
    }
)
```


# 添加错误钉钉提醒

1. 安装dingding包`pip install apache-airflow-providers-dingding[http]`
2. 添加dingding连接到airflow，钉钉群机器人[申请方式见官方](https://open.dingtalk.com/document/group/custom-robot-access)，password仅填写`token=`后面的内容

    ![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_f158d720bee6ec682ac17049e2dbc988.png)

3. 编写错误回调dingding提醒回调函数

    ```python
    from airflow.providers.dingding.operators.dingding import DingdingOperator
    
    
    def failure_callback(context):
        """
        The function that will be executed on failure.
        param context: The context of the executed task.
        """
        message = (
            f"#### AIRFLOW TASK FAILURE TIPS\n"
            f"**DAG_ID**: > {context['task_instance'].dag_id}\n"
            f"**TASKS**: > {context['task_instance'].task_id}\n"
            f"**REASON**: > {context['exception']}\n"
        )
        return DingdingOperator(
            task_id='dingding_success_callback',
            dingding_conn_id='dingding_default',
            message_type='markdown',
            message=message,
            at_all=False,
        ).execute(context)
    ```

4. 在dag中配置错误回调

    ```python
    default_args = {
        "on_failure_callback": failure_callback
    }
    ```


# 任务实际执行时间、逻辑执行时间、与变量ds


airflow的默认时区是UTC，这也是[官方](https://airflow.apache.org/docs/apache-airflow/stable/timezone.html)推荐的，其schedule也是以UTC时区存储和使用，将时区的转换交给了DAG编写者控制

> Airflow returns time zone aware datetimes in templates, but does not convert them to local time so they remain in UTC. It is left up to the DAG to handle this.

我们在大陆地区，设置DAG的运行时间为每天早晨8点(UTC+8，上海时区)，如下图所示，任务实际运行时间为2023-01-09 08:00:00(UTC+8 时区)， 逻辑时间是前一天2023-01-08 08:00:00(UTC+8 时区)， 运行日志文件名为xx_2023-01-08 00:00:00(UTC 时区)， 这个时候代码中使用的airflow变量`{{ ds }}`的值为 2023-01-08(UTC)


![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_8dfc2a873c2d213868333bfb649e75ce.png)


如果我们设置DAG运行时间为每天凌晨0点(UTC+8，上海时区)，那么我们在19号早上查看记录，任务实际运行时间为2022-09-19 00:00:00(UTC+8 时区) ，逻辑时间是前一天 2022-09-18 00:00:00(UTC+8 时区)， 运行日志文件名为xx_2022-09-17 16:00:00(UTC 时区)，这个时候代码中使用的airflow变量`{{ ds }}`的值为 2022-09-17(UTC)


![Untitled.png](images/db974ca7-8565-4823-b420-12b1b204e0a9_06a46fd9ce2ca2983d50fed012f166cd.png)


> 💡 我们在编写DAG的时间，就需要注意这8个小时所带来的问题


# DAG之间的调度


父任务


```sql
# -*- coding:utf-8 -*-

from datetime import timedelta

import pendulum
from airflow import DAG
from airflow.models.baseoperator import chain
from airflow.operators.empty import EmptyOperator
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.utils.task_group import TaskGroup

from sobey.utils.dingding_alert import failure_callback

default_args = {
    'owner': 'wiley',
    "retries": 0,
    "retry_delay": timedelta(minutes=3),
    "on_failure_callback": failure_callback
}

# [START instantiate_dag]
with DAG(
        dag_id='spider',
        default_args=default_args,
        description='爬虫',
        schedule_interval='0 1 * * *',
        start_date=pendulum.datetime(2022, 11, 6, tz='Asia/Shanghai'),
        tags=['spider'],
        template_searchpath=['/root/airflow/dags/sobey/']
) as dag:
    run_start = EmptyOperator(
        task_id='start',
    )

    # 执行下游的执行的dag
    trigger = 
TriggerDagRunOperator
(
        task_id='to_run_ods',
				
# 下游的dag id

        trigger_dag_id="ods",
				
# 可传递参数

        conf={"message": "spider success"}
    )

    run_start >> trigger
```


子任务


```sql
# -*- coding:utf-8 -*-
import pendulum
from airflow import DAG
from airflow.decorators import task
from airflow.operators.bash import BashOperator
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.utils.task_group import TaskGroup

from sobey.utils.dingding_alert import failure_callback


@task(task_id="run_this")
def run_this_func(dag_run=None):
    """
    Print the payload "message" passed to the DagRun conf attribute.
    param dag_run: The DagRun object
    """
    print(f"Remotely received value of {dag_run.conf.get('message')} for key=message")


default_args = {
    'owner': 'wiley',
    "retries": 0,
    "retry_delay": timedelta(minutes=3),
    "on_failure_callback": failure_callback
}

# [START instantiate_dag]
with DAG(
        dag_id='ods',
        default_args=default_args,
        description='ods调度',
        # 此处的周期时间设置为None
        schedule_interval=None,
        start_date=pendulum.datetime(2022, 11, 6, tz='Asia/Shanghai'),
        tags=['ods'],
        # 关闭过期任务执行
        catchup=False,
        is_paused_upon_creation=False,
        dagrun_timeout=timedelta(hours=1),
        template_searchpath=['/root/airflow/dags/sobey/']
) as dag:
    run_this = run_this_func()

    run_start = BashOperator(
        task_id='start_ods',
        bash_command='echo "Here is the message: $message"',
				
# 使用dag_run.conf.get("message")即可接受上游参数

        env={'message': '{{ dag_run.conf.get("message") }}'},
    )

    run_this >> run_start
```


> 💡 子任务中的逻辑时间和实际执行时间一致，而非父任务的逻辑时间，可采用参数传递的方式解决这个问题

