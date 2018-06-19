IMG_TAG=sanguohot/bcos-server:1.0
SERVER_PATH=/opt/bcos-server
BACKEND_PATH=/opt/bcos-server/src/backend/
docker run -it -d --name bcos-server \
-v ${BACKEND_PATH}/log:${BACKEND_PATH}/log \
-v ${BACKEND_PATH}/etc:${BACKEND_PATH}/etc \
-v /etc/letsencrypt/:/etc/letsencrypt \
-p 443:443 \
${IMG_TAG}