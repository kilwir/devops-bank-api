#!/usr/bin/env bash

docker-compose -f docker-compose.test.yml down
docker build -t devops/bank-api -f Dockerfile.api .
docker build -t devops/bank-api-test -f Dockerfile.test .
cp docker-compose.test.yml docker-compose.yml
docker-compose run --rm -d db node-api
docker-compose run --rm node-api-test
status=$?
echo "Exit status : $status"
rm docker-compose.yml
exit $status
