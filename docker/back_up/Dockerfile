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

# RUN pip3 install -i https://pypi.doubanio.com/simple/ uwsgi \
#   # 更新pip3的源
#   && pip3 install --upgrade pip

# 环境变量
# 不使用mysql所以此处暂时不用
# ENV MYSQL_DATABASE_NAME typhoon
# ENV EMAIL_HOST_USER myemail@email.com
# ENV EMAIL_HOST_PASSWORD my-secret-password


# nginx、supervisor配置
# 创建保存nginx日志的目录
RUN echo "daemon off;" >> /etc/nginx/nginx.conf 
# && mkdir -p /var/log/nginx/
COPY nginx-app.conf /etc/nginx/sites-available/default
COPY supervisor-app.conf /etc/supervisor/conf.d/


# 拷贝 requirements.txt
RUN mkdir -p /code/typhoon/webserver/TyphoonSystem/\
  && mkdir /docker
COPY ./requirements.txt /docker


# RUN pip install -i https://pypi.doubanio.com/simple/ -r /home/docker/code/Lighten/requirements.txt
RUN pip3 install -i https://pypi.doubanio.com/simple/ -r /docker/requirements.txt

# uwsgi.ini 及 uwsgi_params

RUN mkdir -p /docker/code/
COPY . /docker/code

EXPOSE 80
CMD ["supervisord","-n"]

