#!/bin/sh

docker build . -t gradebook:backend
docker stop gbbackend || true
docker rm gbbackend || true
docker run --rm --name gbbackend -d -p 8100:8000 gradebook:backend