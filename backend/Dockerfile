FROM python:latest

ENV PYTHONUNBUFFERED 1

RUN mkdir /usr/src/app

WORKDIR /usr/src/app/

COPY . /usr/src/app/

RUN pip install -r requirements.txt
