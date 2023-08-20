#!/usr/bin/env bash

docker buildx build --tag knonm/knonm.dev:dev .
docker run -i -t -p 8080:8080 -v $(pwd)/public:/app/public knonm/knonm.dev:dev

exit 0
