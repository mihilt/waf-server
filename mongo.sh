# pull mongo
echo "=> Pull mongo image..."
docker pull mongo

# stop container
echo "=> Stop previous container..."
docker stop waf-db

# run mongo
echo "=> Run mongo..."
docker run --rm -d -p 27017:27017 --name waf-db -v ~/data:/data/db mongo

