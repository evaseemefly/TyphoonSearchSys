FROM ubuntu:18.04

MAINTAINER Dockerfiles


# 安装git、python、nginx、supervisor等，并清理缓存

RUN apt-get update && \
  apt-get upgrade -y && \ 
  apt-get install -y \
  git \
  python3.6 \
  python3-dev \
  python3-setuptools \
  python3-pip \
  nginx \
  supervisor \
  libmysqlclient-dev && \
  pip3 install --upgrade -i https://pypi.doubanio.com/simple/ pip setuptools && \
  rm -rf /var/lib/apt/lists/*

RUN mkdir /code
WORKDIR /code
COPY requirements.txt /code/
# RUN pip install -i https://pypi.doubanio.com/simple/ -r /home/docker/code/Lighten/requirements.txt
RUN pip3 install -i https://pypi.doubanio.com/simple/ -r /code/requirements.txt
RUN pip3 install -r requirements.txt
# 此处copy之后在容器中的目录为：
# /code/TyphoonSystem/ 为django项目的根目录
COPY . /code/



