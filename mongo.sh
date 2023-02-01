# pull mongo
echo "=> Pull mongo image..."
docker pull mongo

# stop container
echo "=> Stop previous container..."
docker stop mongodb-container

# remove container
echo "=> Remove previous container..."
docker rm -f mongodb-container

# run mongo
echo "=> Run mongo..."
docker run -d -p 27017:27017 --name mongodb-container -v ~/data:/data/db mongo

