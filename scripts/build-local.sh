docker-compose --env-file  .env -f  docker/docker-compose.local.yaml up -d --build
docker exec backend npm run migration:run --prefix /build
