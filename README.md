TO RUN THE DATABSE WITH DOCKER:

```sh
docker run \
  --publish=7474:7474 --publish=7687:7687 \
  --volume=$HOME/neo4j/data:/data \
  --name=neo4j \
  --env=NEO4J_AUTH=neo4j/password123 \
  neo4j
```

ENV VARIABLES:
APPLICATION_PORT=3000
DATABASE_URL_CONNECTION=bolt://localhost:7687
DATABASE_USERNAME=neo4j
DATABASE_PASSWORD=password123
JWT_SECRET=secret