#!/bin/bash
cd $1
echo Starting Docker stack [$1]
docker-compose up -d
cd ..
