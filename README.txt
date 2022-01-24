## Iniciar o Redis pelo Docker
```sh
docker run --rm -p 6379:6379 redis:alpine
docker exec -it d093a5ed67fa /bin/sh
````

## Iniciar no modo desenvolvimento
```sh
yarn&&yarn dev
````

## Executar comandos no Redis
```sh
docker ps #obter o id
docker exec -it [id] /bin/sh
````

## Para publicar e se inscrever em um canal
```sh
redis-cli subscribe QUEUE_UPDATED
redis-cli publish QUEUE_UPDATED "{\"getQueueByPatientId\":{\"queueId\":\"123\",\"patientId\":\"123123\",\"status\":\"READY\",\"position\":\"20\",\"updatedAt\":\"2021\"}}"
```

## Endpoints

### Graphql

- http://localhost:4000/graphql

### Subscriptions

- ws://localhost:4000/subscriptions