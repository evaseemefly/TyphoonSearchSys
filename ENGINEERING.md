### 项目工程化
#### 使用docker-compose 实现容器化编排  
#### 线上部署记录  
工程目录
```js
.
├── docker_commit
│   └── nginx
├── docker_images // docker 镜像存放目录
│   └── ty_django_mongo_init.tar 
├── docker_share  // docker 挂在 volumns 配置项目录
│   └── nginx
├── env         
├── envs
├── proj         // 各类工程目录
│   ├── ty_search_mongo_client  // 前端目录
│   └── ty_search_mongo_server  // 后端目录 docker 容器挂在的 volumns 映射路径，修改后端直接更新此目录
```  

### 1 django+mongo 服务
```js
└── ty_search_mongo_server
    ├── codes
    │   ├── apps
    │   │   ├── apps
    │   │   ├── __init__.py
    │   │   ├── __pycache__
    │   │   └── Typhoon
    │   ├── common
    │   │   ├── dateCommon.py
    │   │   └── __pycache__
    │   ├── env
    │   │   └── requirements.txt
    │   ├── __init__.py
    │   ├── manage.py
    │   ├── start.sh // 暂时不用
    │   ├── Typhoon
    │   │   ├── admin.py
    │   │   ├── apps.py
    │   │   ├── __init__.py
    │   │   ├── middle_models.py
    │   │   ├── models.py
    │   │   ├── serializers.py
    │   │   ├── tests.py
    │   │   ├── urls.py
    │   │   ├── view_decorator.py
    │   │   ├── views_base.py
    │   │   └── views.py
    │   ├── TyphoonSystem
    │   │   ├── __init__.py
    │   │   ├── __pycache__
    │   │   ├── settings.py
    │   │   ├── urls.py
    │   │   └── wsgi.py
    │   └── typhoon_uwsgi.ini
    ├── docker-compose.yml // 容器编排文件
    ├── dockerfiles
    │   └── django_server_file // dockerfile
    └── log

```

 [docker-compose.yml](./docker/new_proj/django/docker-compose.yml)
```yml
version: "2.2"

services:
  django-server:
    build:
      context: .
      dockerfile: ./dockerfiles/django_server_file
    image: ty_search_mongo:1.5
    container_name: ty_search_django_sever
    working_dir: /code
    command: python3 ./manage.py runserver 0.0.0.0:8000
    volumes: # 挂载本地盘
      - /home/nmefc/proj/ty_search_mongo_server/log:/log # 日志
      - /home/nmefc/proj/ty_search_mongo_server/codes:/code # 实际项目代码
    ports:
      - "8084:8000" # 宿主机:docker 端口映射
    depends_on:
      - mongo
    tty: true # 第一次上线测试时加入，去掉上面的 command，手动进入容器后方便查看问题

  mongo:
    container_name: mongo
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - /home/nmefc/dbs:/data/db
```

[dockerfiles](./docker/new_proj/django/dockerfiles/django_server_file)
```sh
# 当前的 docker images
FROM ty_search_mongo:1.5 

ENV PYTHONUNBUFFERED 1

# 1- 根目录下创建 /code 目录
RUN mkdir -p /code

# 2- 将 /code 设置为工作目录
WORKDIR /code

# 3- 将本地目录下的文件全部拷贝至容器 /code 中
# TODO:[-] 21-10-11 注意也可以忽略，最好不要拷贝 orm 生成的 migration 的文件
COPY /home/nmefc/proj/ty_search_mongo_server/codes /code/

# CMD ["python3","./apps/manage.py","runserver","0.0.0.0:8000"]
```

### 2 前端 + nginx 服务
`docker-compose.yml`所在路径`/home/nmefc/docker_commit/nginx`
[详见](./docker/new_proj/nginx/docker-compose.yml)
```yml
version: '2.0' #版本号
services: 
  nginx:
    restart: always 
    image: daocloud.io/library/nginx:1.19.2 #镜像地址
    container_name: nginx #容器名
    ports:
      - 82:82 # 静态文件的访问端口
      - 8080:8080 # vue 的访问端口
    volumes:  #数据卷映射地址
      # 线上环境
      - /home/nmefc/docker_share/nginx/conf:/etc/nginx/conf.d
      - /home/nmefc/proj/ty_search_mongo_client/dist:/dist  # 历史台风路径查询 dist
```
映射nginx的配置文件
[配置文件](./docker/new_proj/nginx/conf/nginx.conf)
```conf
server {
		# 历史台风查询系统
        listen       8082;
        server_name  localhost_ty_search_mongo;
		location / {
				root  /ty_search_mongo_dist ;   #打包的dist文件夹存放路径
				index  index.html index.htm;
				try_files $uri $uri/ /index.html =404;
			}

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   html;
    }

}
```
- 注意: `.conf`配置文件中的 `/ty_search_mongo_dist` 是为容器中的路径，额外单独做了volumes映射
  ```js
  /home/nmefc/proj/ty_search_mongo_client/dist : /ty_search_mongo_dist
  ```