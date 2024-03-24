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
