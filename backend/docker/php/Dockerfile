FROM php:8.3-fpm

ARG UID=1000
ARG GID=1000

ARG http_proxy
ARG https_proxy

ENV http_proxy=${http_proxy}
ENV https_proxy=${https_proxy}

RUN apt-get update && apt-get install -y git unzip libicu-dev libzip-dev \
    && docker-php-ext-install intl pdo_mysql zip opcache \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g ${GID} dev && useradd -m -u ${UID} -g ${GID} -s /bin/bash dev
USER dev


COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/app