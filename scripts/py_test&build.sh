#!/bin/bash

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "Docker is not running. Terminating script execution."
    exit 1
fi

# how to use: ./py_test&build.sh <microservice_name>
if [ -z "$n" ]
then
    microservice=$(ls -v ./microservices | tail -n 1)
    microservice_version=$(echo $microservice | cut -d '-' -f 2)
    microservice_name=$(echo $microservice | cut -d '-' -f 4 | cut -d '/' -f 1)
else
    microservice_version=$(echo $n | cut -d '-' -f 2)
    microservice_name=$(echo $n | cut -d '-' -f 4 | cut -d '/' -f 1)
fi

microservice_name=$(echo $microservice_name | tr '[:upper:]' '[:lower:]')

echo
echo $microservice_name
echo

version=$(docker images | grep $microservice_name | sort -r | head -n 1 | awk '{print $2}')
if [ -z "$version" ]
then
    version="1.0.0"
else
    version=$(echo $version | awk -F. -v OFS=. '{$NF++;print}')
fi

# Build the Docker image with the new version number
docker build --build-arg VERSION=$version -t $microservice_name:$version ./microservices/-$microservice_version--$microservice_name || { echo 'Docker build failed' ; return; }

if docker ps -a | grep -q $microservice_name; then
    echo "Stopping and removing existing container..."
    docker stop $microservice_name
    docker rm $microservice_name
fi

docker run -d -p 3000:3000 --name $microservice_name $microservice_name:$version

