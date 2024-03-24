# Fullstack Docker - The Real World Programmer

We use Docker to easily run backend services for our application. 
It is easy to run specific versions of applications such as MySQL using Docker.
It also enables us to explore how to containerize our own applications for production 
use them later to deploy on more complex technologies such as Kubernetes.

## Docker
Install [Docker](https://www.docker.com/) (outside the scope of this project)
### Create a docker directory to contain folders for each service to be deployed on Docker
```bash
mkdir docker
```

### Convenience scripts

* Create a `stack_up.sh` script to launch docker-compose

```bash
#!/bin/bash
cd $1
echo Starting Docker stack [$1]
docker-compose up -d
cd ..
```

Make `stack_up.sh` executable:
```bash
chmod u+x stack_up.sh
```

* Create a `stack_down.sh` script to shut down a Docker stack

```bash
#!/bin/bash

read -p "Are you sure you want to destroy stack [$1]? (y/n) " yn

case $yn in
y) echo Ok, destroying stack [$1] ;;
n)
  echo Stack shutown cancelled...
  exit
  ;;
*)
  echo Invalid response, expected (y/n)
  exit 1
  ;;
esac

cd $1
docker-compose down
cd ..
```

Make `stack_down.sh` executable:
```bash
chmod u+x stack_down.sh
```

You can now easily start up and shutdown a stack using these scripts examples:

```bash
./stack_up.sh SERVICE_FOLDER_NAME
```

```bash
./stack_down.sh SERVICE_FOLDER_NAME
```

Please note that stack_down.sh will not remove custom volumes and those need to be removed manually

### Apache HTTP Proxy
We are using an HTTP proxy to allow our Backend and Frontend to be accessible on the same webserver. 
Our backend by default listens on port `8080` and is accessible on the url http://localhost:8080. 
Our frontend by default listens on port `4200` and is accessible on the url http://localhost:4200.

This poses a problem. We want to write our frontend code to use relative paths to access our backend and need to
host the solution on a single base url such as http://localhost.

This is why we set up a reverse proxy on http://localhost and will use `/*` to direct traffic to the frontend and
`/api/*` requests to the backend.

Create a folder for your HTTP proxy. 
```bash
mkdir fullstack-dev-proxy
```

### Apache docker-compose

Create the following files:
* Create `docker-compose.yml` file. Notice how we pass in `host.docker.internal` as the `HOST` environment variable. 
* We want the proxy to hit our services running on the host machine during development
* In a production environment we would pass the internal docker hostnames for each service `backend` and `frontend` when they are running inside Docker as `containers` 

```yaml
version: '3.8'

services:
  fullstack-proxy:
    build: .
    container_name: fullstack-proxy
    hostname: fullstack-proxy
    ports:
      - 80:80
    restart: unless-stopped
    environment:
      HOST: host.docker.internal
    networks:
      - default
networks:
  default:
    driver: bridge
```

### Apache Dockerfile

* Create custom `Dockerfile`
* This Dockerfile builds a container based on debian and runs an Apache web server. 
* Relevant Apache modules are enabled to support reverse proxying to our services

```Dockerfile
FROM debian:latest

MAINTAINER therealworldprogrammer <therealworldprogrammer@gmail.com>

ENV DEBIAN_FRONTEND noninteractive

RUN apt update \
&& apt -y install \
apache2 \
nano

RUN a2enmod proxy \
&& a2enmod proxy_http \
&& a2enmod proxy_wstunnel \
&& a2enmod ssl \
&& a2enmod rewrite \
&& a2enmod headers \
&& service apache2 stop

EXPOSE 80 443

COPY ./fullstack-vhost.conf /etc/apache2/sites-available/fullstack-vhost.conf

RUN a2ensite fullstack-vhost.conf
RUN a2dissite 000-default
RUN rm -f /var/run/apache2/apache2.pid

ENTRYPOINT ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
```

### Apache Virtual Host

* Create custom [Apache Virtual Host](https://httpd.apache.org/docs/2.4/vhosts/) configuration file `fullstack-vhost.conf`
* This Apache virtual host will route all HTTP requests to the frontend and any requests prefixed with `/api` to the backend
* It is also important to note the `websocket` upgrade feature. The Angular server will notify the browser to reload using the `websocket` protocol that changes have been made and to reload the browser 

```
<VirtualHost _default_:*>
  Header set Access-Control-Allow-Origin "*"
  Header set Access-Control-Allow-Headers "Content-Type,Authorization"
  Header set Access-Control-Allow-Credentials true

  ProxyRequests Off
  ProxyVia Off
  ProxyPreserveHost On

  ProxyStatus On

  ProxyPass "/api/"  http://${HOST}:8080/
  ProxyPassReverse "/api/"  http://${HOST}:8080/

  ProxyPass "/"  http://${HOST}:4200/
  ProxyPassReverse "/"  http://${HOST}:4200/

  RewriteCond %{HTTP:Upgrade} websocket [NC]
  RewriteCond %{HTTP:Connection} upgrade [NC]

  RewriteRule ^/?(.*) "ws://${HOST}:4200/$1" [P,L]

</VirtualHost>
```

### Launch Apache

Within the docker directory start up the Apache container

```bash
./stack_up.sh fullstack-dev-proxy
```

Apache should now be reachable on http://localhost. If you get an error that port number `80` is already in use, 
try another port mapping to use an available port on your host. For example using `81:80`, your Apache server should
be available on http://localhost:81

### MySQL database
Create a folder for your MySQL database configuration
```bash
mkdir fullstack-mysql
```

### MySQL docker-compose

Create the following files:
* Create `docker-compose.yml` file. 

```yaml
version: "3.8"
services:
  fullstack-mysql:
    image: mysql:8.0.29
    container_name: fullstack-mysql
    hostname: fullstack-mysql
    ports:
      - 3306:3306
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: 'fullstack'
      MYSQL_ROOT_USERNAME: 'root'
      MYSQL_ROOT_PASSWORD: 'notagoodpassword'
      MYSQL_ROOT_HOST: '%'
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci --lower_case_table_names=1
    volumes:
      - vol-fullstack-mysql:/var/lib/mysql:rw
    networks:
      - default

volumes:
  vol-fullstack-mysql:
    name: vol-fullstack-mysql

networks:
  default:
    driver: bridge
```

```bash
./stack_up.sh fullstack-mysql
```

Your MySQL database should now be available on the default port `3306`. If you have an existing MySQL installation and are
getting port clashes, you can easily configure a different port mapping e.g. `33060:3306` and your database should now be
accessible on your host at port `33060`.

This is one of the beauties of containerization. It allows us to easily run multiple of the same service using specific versions
and configuration along with their own ports.
