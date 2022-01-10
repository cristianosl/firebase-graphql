## no console

docker run --rm -p 6379:6379 redis:alpine
docker exec -it d093a5ed67fa /bin/sh

# no redis

redis-cli subscribe QUEUE_UPDATED
redis-cli publish QUEUE_UPDATED "{\"getQueueByPatientId\":{\"queueId\":\"123\",\"patientId\":\"123123\",\"status\":\"READY\",\"position\":\"20\",\"updatedAt\":\"2021\"}}"