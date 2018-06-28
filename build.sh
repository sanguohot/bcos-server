#!/bin/bash
IMG_TAG=sanguohot/bcos-server:3.5
#docker build . -t ${DRP_TAG}
#docker push ${DRP_TAG}
from_path=$PWD
dockerfile_path=$(cd `dirname $0`;pwd)
cd $dockerfile_path
docker build . -t ${IMG_TAG}
docker push ${IMG_TAG}
cd $from_path