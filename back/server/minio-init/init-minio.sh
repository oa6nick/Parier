#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}[INFO] Starting MinIO initialization...${NC}"

# Проверяем переменные окружения
if [ -z "$S3_ACCESS_KEY" ] || [ -z "$S3_SECRET_KEY" ] || [ -z "$S3_BUCKET" ] || [ -z "$S3_ENDPOINT" ]; then
    echo -e "${RED}[ERROR] Missing required environment variables${NC}"
    echo "Required: S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET, S3_ENDPOINT"
    exit 1
fi

# Ждем готовности MinIO
echo -e "${YELLOW}[INFO] Waiting for MinIO to be ready...${NC}"
until curl -f "${S3_ENDPOINT}/minio/health/live" 2>/dev/null; do
    echo -e "${YELLOW}[INFO] MinIO not ready yet, waiting...${NC}"
    sleep 2
done

echo -e "${GREEN}[INFO] MinIO is ready!${NC}"

# Настраиваем MinIO client
echo -e "${YELLOW}[INFO] Configuring MinIO client...${NC}"
mc alias set minio-local "$S3_ENDPOINT" "$S3_ACCESS_KEY" "$S3_SECRET_KEY"

if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Failed to configure MinIO client${NC}"
    exit 1
fi

# Создаем bucket, если он не существует
echo -e "${YELLOW}[INFO] Creating bucket '${S3_BUCKET}'...${NC}"
mc mb "minio-local/${S3_BUCKET}" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS] Bucket '${S3_BUCKET}' created successfully${NC}"
else
    echo -e "${YELLOW}[INFO] Bucket '${S3_BUCKET}' already exists${NC}"
fi

# Устанавливаем публичную политику для разработки
echo -e "${YELLOW}[INFO] Setting public read policy for development...${NC}"
mc anonymous set public "minio-local/${S3_BUCKET}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[SUCCESS] Public policy set successfully${NC}"
else
    echo -e "${YELLOW}[WARNING] Failed to set public policy${NC}"
fi

mc cp --recursive /files/* minio-local/${S3_BUCKET} 

# Проверяем созданный bucket
echo -e "${YELLOW}[INFO] Listing buckets...${NC}"
mc ls minio-local/

# Проверяем статус bucket
echo -e "${YELLOW}[INFO] Checking bucket status...${NC}"
mc ls "minio-local/${S3_BUCKET}"

echo -e "${GREEN}[SUCCESS] MinIO initialization completed successfully!${NC}"
echo -e "${GREEN}[INFO] Bucket: ${S3_BUCKET}${NC}"
echo -e "${GREEN}[INFO] Endpoint: ${S3_ENDPOINT}${NC}"
echo -e "${GREEN}[INFO] Access Key: ${S3_ACCESS_KEY}${NC}" 