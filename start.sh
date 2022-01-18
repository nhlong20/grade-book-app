#!/bin/sh

docker stop frontend || true
docker pull ghcr.io/nhlong20/grade-book-app:frontend
docker run --rm --name frontend -d -p 3000:3000 ghcr.io/nhlong20/grade-book-app:frontend
cd ~/grade-book-app/backend
docker-compose down
docker-compose pull backend
docker-compose up -d
yes | docker image prune