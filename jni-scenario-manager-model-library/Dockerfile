FROM python:3.10 AS service

WORKDIR /usr/src/app

RUN pip install --upgrade pip

COPY src/. .
RUN pip install -r requirements.txt
#RUN rm .env
