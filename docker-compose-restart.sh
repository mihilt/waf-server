# down docker-compose
echo "=> Down docker-compose..."
docker-compose down -v

# build and up docker-compose
echo "=> Build and up docker-compose..."
docker-compose up -d --build