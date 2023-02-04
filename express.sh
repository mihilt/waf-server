. ./.env

# git pull
echo "=> Git pull..."
git pull https://${GITHUB_ID}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git

# stop container
echo "=> Stop previous container..."
docker stop ${CONTAINER_NAME}

# remove container
echo "=> Remove previous container..."
docker rm -f ${CONTAINER_NAME}

# remove image
echo "=> Remove previous image..."
docker rmi -f ${DOCKER_USER_NAME}/${IMAGE_NAME}:${VERSION}

# new-build/re-build docker image
echo "=> Build new image..."
docker build --tag ${DOCKER_USER_NAME}/${IMAGE_NAME}:${VERSION} .

# Run container
echo "=> Run container..."
docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${DOCKER_USER_NAME}/${IMAGE_NAME}:${VERSION}

# TODO: deploy docs to 80 port