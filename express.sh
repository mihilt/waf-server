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
docker run --rm -d -p 8080:8080 --name waf-server mihilt/waf-server:latest