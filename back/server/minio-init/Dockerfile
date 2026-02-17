FROM alpine:latest

# Устанавливаем необходимые пакеты
RUN apk add --no-cache curl bash

# Скачиваем и устанавливаем MinIO client
RUN curl -o /usr/local/bin/mc https://dl.min.io/client/mc/release/linux-amd64/mc \
    && chmod +x /usr/local/bin/mc \
    && mc --help

# Копируем скрипт инициализации
COPY init-minio.sh /init-minio.sh
COPY files /files
RUN chmod +x /init-minio.sh

# Запускаем скрипт инициализации
CMD ["/init-minio.sh"]