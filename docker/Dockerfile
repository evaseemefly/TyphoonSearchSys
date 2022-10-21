FROM python:3.6
ENV PYTHONUNBUFFERED 1


# 安装git、python、nginx、supervisor等，并清理缓存

RUN apt-get update && \
  apt-get upgrade -y && \ 
  apt-get install -y \
  git \
  python3 \
  python3-dev \
  python3-setuptools \
  python3-pip \
  nginx \
  supervisor \
  libmysqlclient-dev && \
  pip3 install --upgrade -i https://pypi.doubanio.com/simple/ pip setuptools && \
  rm -rf /var/lib/apt/lists/*

RUN pip3 install -i https://pypi.doubanio.com/simple/ uwsgi



RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/