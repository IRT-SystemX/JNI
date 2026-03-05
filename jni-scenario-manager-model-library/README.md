# JNI1 Workflow Manager API

## Introduction

The JNI1 Workflow Manager API is designed to facilitate the management and configuration of workflows in a dynamic model
library. This API allows users to interact with the system, manage workflows efficiently, and potentially ensure the
persistence of workflow configurations in databases.

## Technology Stack

- **Python**: The programming language used.
- **FastAPI**: High-performance web framework for building APIs with Python 3.7+ based on standard Python type hints.
- **Uvicorn**: ASGI server for FastAPI that enables asynchronous capabilities, enhancing performance.
- **ODMantic**: Sync and Async ODM (Object Document Mapper) for MongoDB based on standard Python type hints. Built on top of Pydantic for model definition and validation.

## API Features

- Basic status checking endpoint to ensure service availability.
- **Workflow** templates and **Task** templates persistence in database.
- CRUD Operations on documents.

## Setup Development Environment

Follow these steps to set up your development environment:

### Prerequisites

Ensure you have Python 3.11 and pip installed on your machine. Optionally, use a virtual environment tool like `venv`
or `conda` to manage dependencies and isolate the project.

### Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone git@git.irt-systemx.fr:jni1/wp4/jni1-workflow-manager.git
cd jni1-workflow-manager/src
```

### Install Dependencies

Install all necessary dependencies by running:

```bash
pip install -r requirements.txt
```

or for conda

```bash
conda env create -f environment.yml
```

and mamba

```bash
mamba env create -f environment.yml
```

### Configure Environment Variables

Copy the `.env.example` file to `.env` and adjust the environment variables to fit your local settings:

```bash
cp .env.example .env
```

### Start the Application

Run the application using main.py as the app entrypoint:

```bash
python main.py
```

### Access the API

The API will be available by default at http://localhost:5050.

Consult the swagger doc at http://localhost:5050/docs

The base endpoint for API operations is configured at `/api/v1`.

### Architecture
A service is comprised of validation components, processing components, and integration components. And then, if we zoom in a bit further, these same validation components are comprised of three more refined components: structural, logical, and external. The pattern continues to go on and on to the lowest level of our design, as shown here:

<br />
	<div align=center>
		<img width="75%" src="https://github.com/hassanhabib/The-Standard/blob/master/0.%20Introduction/Resources/The%20Theory/The%20Theory-0.0.5%202.png?raw=true" />
	</div>
<br />

The same pattern also applies to larger systems if we zoom out of the one system realm into distributed modern systems such as microservice architectures - the same pattern should apply as follows:

<br />
	<div align=center>
		<img width="65%" src="https://github.com/hassanhabib/The-Standard/blob/master/0.%20Introduction/Resources/The%20Theory/The%20Theory-0.0.5%203.png?raw=true" />
	</div>
<br />

In a distributed system, some services act as ambassadors to external or local resources, equivalent to a broker component at the service level.

#### Flow Forward
Services cannot call services at the same level. For instance, Foundation Services cannot call other Foundation Services, and Orchestration Services cannot call other Orchestration Services from the same level.
This principle is called a Flow-Forward - as the illustration shows:


<br />
<p align=center>
    <img src="https://user-images.githubusercontent.com/1453985/236656309-30864ae2-860c-4a90-9bf5-db145a072e1b.png">
</p>
<br />

