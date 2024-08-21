# Basic nestjs application with database, redis and logger.

Template project for nestjs application

## Features:

<ul>
<li>Config service with env validation.</li>
<li>Postgres database with typeorm and migrations.</li>
<li>Redis with cache service.</li>
<li>Configured Swagger for documentation.</li>
</ul>

## Technologies:

<ul>
<li>NestJS (backend framework)</li>
<li>TypeORM (object-relational mapper with migrations)</li>
<li>Redis (in-memory data store for caching)</li>
</ul>

## Getting Started:

<ol>
  <li> Clone this repository. </li>
  <li> Install dependencies: <code> npm install </code></li>
  <li> Create a .env file in the root directory, refer .env.example file  </li>
  <li> Run docker containers for local development <code> sh scripts/build-local.sh </code> </li>
  <li> Run migrations <code> npm run migration:run </code> in backend directory</li>
  <li> Start the application: <code> npm run start:dev </code> in backend directory </li>
</ol>

## Extra:

You can also run your app in remote machine
By running script <code> sh scripts/build-prod.sh </code> 

<ol>
  <li> For local development: <code> sh scripts/build-local.sh </code>  </li>
  <li> For production(staging) development: <code> sh scripts/build-prod.sh </code>  </li>
  <li> For locally testing production(staging): <code> sh scripts/test-build-prod.sh </code>  </li>
</ol>