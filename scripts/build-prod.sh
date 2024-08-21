chown -R ${USER} .
chown ${USER}:docker volumes/
chmod 770 volumes/
docker-compose --env-file .env -f  app/docker/docker-compose.yaml up -d --build

# TODO: Fix it
docker-compose --env-file .env -f  app/docker/docker-compose.yaml restart database
rm -R app     