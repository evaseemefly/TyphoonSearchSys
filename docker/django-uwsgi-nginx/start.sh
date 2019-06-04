#!/bin/bash

# 镜像不存在时创建镜像
if ! docker images | grep lighten; then
    echo 'The docker image does not exist,'
    echo 'Now creating image <lighten>...'
    docker build -t lighten $(pwd)
fi

# 镜像存在时，检查容器是否存在
if docker ps -a | grep -i lighten; then
    # 容器存在时则删除容器
    echo 'The docker container <lighten> already exist, deleting it...'
    docker rm -f webapp-lighten
fi

echo 'run webapp-lighten..'
docker run -itd \
           --link mysql-lighten:mysql \
           -v /root/git_repo/Lighten/:/home/docker/code/Lighten \
           --name webapp-lighten \
           -p 80:80 \
       lighten \
       sh -c 'python /home/docker/code/Lighten/manage.py migrate && supervisord -n'
