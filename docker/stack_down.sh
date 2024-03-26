#!/bin/bash

read -p "Are you sure you want to destroy stack [$1]? (y/n) " yn

case $yn in
y) echo Ok, destroying stack [$1] ;;
n)
  echo Stack shutown cancelled...
  exit
  ;;
*)
  echo "Invalid response, expected (y/n)"
  exit 1
  ;;
esac

cd $1
docker-compose down -v
cd ..
