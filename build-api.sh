#!/usr/bin/env bash

docker-compose down
echo "Build..."
docker build -t devops/bank-api -f Dockerfile.api .
#cp docker-compose.api.yml docker-compose.yml
echo "Compose..."
docker-compose -f docker-compose.api.yml up -d
echo "Api launch"
#rm docker-compose.yml
