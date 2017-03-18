#!/usr/bin/env bash

docker-compose -f docker-compose.api.yml down
docker build -t devops/bank-api -f Dockerfile.api .
cp docker-compose.api.yml docker-compose.yml
docker-compose up -d
echo "Api launch"
rm docker-compose.yml
