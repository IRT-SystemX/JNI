from datetime import timedelta, datetime
from typing import List
from uuid import uuid4

from brokers.storage_broker import StorageBroker
from models.foundations.decision_system_archive_items.DecisionSystemArchiveItem import DecisionSystemArchiveItem
from models.foundations.task_templates.TaskTemplate import TaskTemplate


async def create_seed_data(broker: StorageBroker):
    task_template: List[TaskTemplate] = [
        TaskTemplate(
            name="Hello World",
            code_block="name: hello world\nsteps:\n  - name: s1\n    command: echo hello world\n  - name: s2\n    command: echo done!\n    depends:\n      - s1",
            description="A simple scenario with two sequential steps, demonstrating basic command execution."
        ),
        TaskTemplate(
            name="Conditional Steps",
            code_block="params: foo\nsteps:\n  - name: step1\n    command: echo start\n  - name: foo\n    command: echo foo\n    depends:\n      - step1\n    preconditions:\n      - condition: \"$1\"\n        expected: foo\n  - name: bar\n    command: echo bar\n    depends:\n      - step1\n    preconditions:\n      - condition: \"$1\"\n        expected: bar",
            description="Demonstrates conditional step execution based on preconditions."
        ),
        TaskTemplate(
            name="File Output",
            code_block="steps:\n  - name: write hello to '/tmp/hello.txt'\n    command: echo hello\n    stdout: /tmp/hello.txt",
            description="A scenario showcasing how to write output to a file."
        ),
        TaskTemplate(
            name="Passing Output to Next Step",
            code_block="steps:\n  - name: pass 'hello'\n    command: echo hello\n    output: OUT1\n  - name: output 'hello world'\n    command: bash\n    script: |\n      echo $OUT1 world\n    depends:\n      - pass 'hello'",
            description="Illustrates passing the output of one step as an input to another step."
        ),
        TaskTemplate(
            name="Running a Docker Container",
            code_block="steps:\n  - name: deno_hello_world\n    executor: \n      type: docker\n      config:\n        image: \"denoland/deno:1.10.3\"\n        host:\n          autoRemove: true\n    command: run https://examples.deno.land/hello-world.ts",
            description="Executing a command in a Docker container."
        ),
        TaskTemplate(
            name="Sending HTTP Requests",
            code_block="steps:\n  - name: get fake json data\n    executor: http\n    command: GET https://jsonplaceholder.typicode.com/comments\n    script: |\n      {\n        \"timeout\": 10,\n        \"headers\": {},\n        \"query\": {\n          \"postId\": \"1\"\n        },\n        \"body\": \"\"\n      }",
            description="Sending an HTTP request with specific configurations."
        ),
        TaskTemplate(
            name="Querying JSON Data with jq",
            code_block="steps:\n  - name: run query\n    executor: jq\n    command: '{(.id): .[\"10\"].b}'\n    script: |\n      {\"id\": \"sample\", \"10\": {\"b\": 42}}",
            description="Using jq to query JSON data."
        ),
        TaskTemplate(
            name="Formatting JSON Data with jq",
            code_block="steps:\n  - name: format json\n    executor: jq\n    script: |\n      {\"id\": \"sample\", \"10\": {\"b\": 42}}",
            description="Formatting JSON data using jq."
        ),
        TaskTemplate(
            name="Outputting Raw Values with jq",
            code_block="steps:\n  - name: output raw value\n    executor:\n      type: jq\n      config:\n        raw: true\n    command: '.id'\n    script: |\n      {\"id\": \"sample\", \"10\": {\"b\": 42}}",
            description="Outputting raw values from JSON using jq."
        ),
        TaskTemplate(
            name="Sending Email Notifications",
            code_block="steps:\n  - name: Sending Email on Finish or Error\n    command: echo \"hello world\"\n\nmailOn:\n  failure: true\n  success: true\n\nsmtp:\n  host: \"smtp.foo.bar\"\n  port: \"587\"\n  username: \"<username>\"\n  password: \"<password>\"\nerrorMail:\n  from: \"foo@bar.com\"\n  to: \"foo@bar.com\"\n  prefix: \"[Error]\"\n  attachLogs: true\ninfoMail:\n  from: \"foo@bar.com\"\n  to: \"foo@bar.com\"\n  prefix: \"[Info]\"\n  attachLogs: true",
            description="Configuring email notifications for task execution outcomes."
        ),
        TaskTemplate(
            name="Sending Email",
            code_block="smtp:\n  host: \"smtp.foo.bar\"\n  port: \"587\"\n  username: \"<username>\"\n  password: \"<password>\"\n\nsteps:\n  - name: step1\n    executor:\n      type: mail\n      config:\n        to: <to address>\n        from: <from address>\n        subject: \"Sample Email\"\n        message: |\n          Hello world",
            description="A step to send an email with SMTP configuration."
        ),
        TaskTemplate(
            name="Customizing Signal Handling on Stop",
            code_block="steps:\n  - name: step1\n    command: bash\n    script: |\n      for s in {1..64}; do trap \"echo trap $s\" $s; done\n      sleep 60\n    signalOnStop: \"SIGINT\"",
            description="Customizing signal handling for a long-running process."
        )
    ]

    decision_system_archive_items: List[DecisionSystemArchiveItem] = [
        DecisionSystemArchiveItem(
            workflow_execution_id=str(uuid4()),
            workflow_name="Risk Assessment",
            aas_name="Equipment",
            property_name="Credit Score",
            workflow_execution_date=datetime.now() - timedelta(days=5),
            updated_date=datetime.now() - timedelta(days=4),
            user_id="user123"
        ),
        DecisionSystemArchiveItem(
            workflow_execution_id=str(uuid4()),
            workflow_name="Dive Approval",
            aas_name="Proto Engine System",
            property_name="pressureAmount",
            workflow_execution_date=datetime.now() - timedelta(days=3),
            updated_date=datetime.now() - timedelta(days=2),
            user_id="user456"
        ),
        DecisionSystemArchiveItem(
            workflow_execution_id=str(uuid4()),
            workflow_name="Fire Detection",
            aas_name="Temperature Monitoring Network",
            property_name="temperatureLimit",
            workflow_execution_date=datetime.now() - timedelta(days=1),
            updated_date=datetime.now(),
            user_id="user789"
        )
    ]

    for item in decision_system_archive_items:
        await broker.insert_archive_item(archive_item=item)

    for data in task_template:
        await broker.insert_task_template(task_template=data)
