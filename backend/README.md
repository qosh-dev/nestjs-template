# NestJS application with TypeORM, Redis, and JWT Authentication

This project provides a secure and scalable NestJS API for managing articles. It utilizes TypeORM with migrations for database persistence, Redis for caching, and JWT authentication for access control.

## Features:

<ul>
<li>Create, retrieve, update, and delete articles.</li>
<li>Search and filter articles using various criteria.</li>
<li>Implement robust caching with Redis for improved performance.</li>
<li>Secure user access with JWT-based authentication.</li>
</ul>

## Technologies:

<ul>
<li>NestJS (backend framework)</li>
<li>TypeORM (object-relational mapper with migrations)</li>
<li>Redis (in-memory data store for caching)</li>
<li>JWT (JSON Web Token) for authentication</li>
</ul>

## Getting Started:

<ol>
  <li> Clone this repository. </li>
  <li> Install dependencies: <code> npm install </code></li>
  <li>
  Create a .env file in the root directory and configure the following environment variables:

  ```
  PORT=2211

  DB_HOST=localhost
  DB_USER=your_username
  DB_PASSWORD=your_password
  DB_DATABASE=your_database_name
  DB_PORT=2231

  REDIS_HOST=localhost
  REDIS_PASSWORD=your_redis_password
  REDIS_PORT=6379

  JWT_SECRET=your_jwt_secret_key (long and complex string)
  JWT_EXPIRE=360000 (in milliseconds, default 1 hour)
  Run database migrations: npm run typeorm:migration
  ```
  </li>

  <li> Run docker containers for Postgres and Redis <code> docker compose up </code> </li>
  <li> Run migrations <code> npm run migration:run </code> </li>
  <li> Start the application: <code> npm run start:dev </code> </li>
</ol>


## API Endpoints:

### Authentication Routes:

<ul>
  <li>
    POST /auth/signup (body: { username, password }): Registration endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    POST /auth/signin (body: { username, password }): Login endpoint to generate JWT token upon successful user credentials validation.
  </li>
  <li>
    GET /current-user/profile (requires valid JWT token): Retrieves currently authenticated user information.
  </li>
</ul>


### Article Routes:

<ul>
  <li> POST /article (Requires authorization): Creates a new article. </li>
  <li> GET /article/:id (Optional authorization): Retrieves an article by its ID. </li>
  <li> GET /article/many (Optional authorization): Retrieves a list of articles with pagination and filtering options. </li>
  <li> PATCH /article/:id (Requires authorization): Updates an existing article. </li>
  <li> 
  DELETE /article/:id (Optional, implement if applicable. Requires authorization): Deletes an article. </li>
</ul>


### Authorization:

The API utilizes JWT (JSON Web Token) for authentication. Successful login via the /auth/signin endpoint provides a JWT token that needs to be included in the authorization header of subsequent requests that require authentication (indicated in the endpoint descriptions).

### Caching:

This project leverages Redis for caching frequently accessed data(articles), potentially improving performance and reducing database load. Caching strategies are implemented within the NestJS application logic.

### Testing:

Unit tests are included to ensure core functionalities.
