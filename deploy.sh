. ./.env

# git pull
echo "=> Git pull..."
git pull https://${GITHUB_ID}:${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${GITHUB_REPO}.git

# down docker-compose
echo "=> Down docker-compose..."
docker-compose down -v

# build and up docker-compose
echo "=> Build and up docker-compose..."
docker-compose up -d --build