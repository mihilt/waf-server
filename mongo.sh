. ./.env

# stop container
echo "=> Stop previous container..."
docker stop waf-db

# pull mongo
echo "=> Pull mongo image..."
docker pull mongo

# run mongo
echo "=> Run mongo..."
docker run --rm \
  -d \
  --name waf-db \
  -p 27017:27017 \
  -v ~/docker-data/mongodb:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME} \
  -e MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD} \
  mongo
