# pull redis
echo "=> Pull redis image..."
docker pull redis

# stop container
echo "=> Stop previous container..."
docker stop redis-container

# remove container
echo "=> Remove previous container..."
docker rm -f redis-container

# run redis
echo "=> Run redis..."
docker run -d -p 6379:6379 --name redis-container redis
