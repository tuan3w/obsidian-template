#!/bin/bash


if [ $# -eq 0 ] 
then
  echo "Usage: ./run_dual.sh big|small"
  exit 1
fi

model_type=$1
echo $model_type

if [ $model_type == "small" ]
then
  echo "Runing dual server with small pretrained model..."
  cd ./.obsidian/plugins/Dual
  rm essence
  ln -s "`pwd`/essence_small" essence
  cd skeleton
  /usr/bin/python3 server.py --path ../../../../
else 
  echo "Running dual server with large pretrained model..."
  cd ./.obsidian/plugins/Dual
  rm essence
  ln -s "`pwd`/essence_big" essence
  cd skeleton
  /usr/bin/python3 server.py --path ../../../../
fi
