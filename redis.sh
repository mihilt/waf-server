# pull redis
echo "=> Pull redis image..."
docker pull redis

# stop container
echo "=> Stop previous container..."
docker stop waf-redis

# run redis
echo "=> Run redis..."
docker run --rm -d -p 6379:6379 --name waf-redis redis
