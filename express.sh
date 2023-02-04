# stop container
echo "=> Stop previous container..."
docker stop waf-server

# remove image
echo "=> Remove previous image..."
docker rmi -f mihilt/waf-server:latest

# new-build/re-build docker image
echo "=> Build new image..."
docker build --tag mihilt/waf-server:latest .

# Run container
echo "=> Run container..."
docker run --rm \
  -d \
  --name waf-server \
  -p 8080:8080 \
  -v ~/docker-data/waf/uploads:/app/public/uploads \
  -v ~/docker-data/waf/logs:/app/logs \
  mihilt/waf-server:latest