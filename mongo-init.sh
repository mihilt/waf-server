. ./.env

# run mongo
. ./mongo.sh

# Wait for MongoDB to start
echo "=> Waiting for MongoDB to start..."
sleep 10

# create mongo user
echo "=> Create mongo user..."
mongosh --host localhost --port 27017 -u "${MONGO_INITDB_ROOT_USERNAME}" -p "${MONGO_INITDB_ROOT_PASSWORD}" \
  --eval "use ${MONGO_INITDB_DATABASE}" \
  --eval "db.init.insertOne({result: true})" \
  --eval "db.createUser({ user: '${MONGO_WAF_USERNAME}', pwd: '${MONGO_WAF_PASSWORD}', roles: [ { role: 'readWrite', db: '${MONGO_INITDB_DATABASE}' } ] })"


# stop container
echo "=> Stop previous container..."
docker stop waf-db
