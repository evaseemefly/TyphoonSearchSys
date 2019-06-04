FROM python:3.6

ENV PYTHONNUMBUFFERED 1

RUN mkdir /code

WORKDIR /code

ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/