## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Deployment with Docker

This project can be run using Docker. The official image is available on Docker Hub.

**Docker Hub Image:** `https://hub.docker.com/r/<tu-usuario-dockerhub>/<nombre-proyecto>`

### Prerequisites

- Docker installed on your machine.

### Running the container

1.  **Pull the image from Docker Hub:**
    ```bash
    $ docker pull <tu-usuario-dockerhub>/<nombre-proyecto>:1.0.0
    ```

2.  **Run the container:**
    You need to provide the environment variables for the MongoDB connection (`MONGO_URI`) and the JWT secret (`JWT_SECRET`).
    ```bash
    $ docker run -d -p 3000:3000 --name mi-ecommerce-api -e MONGO_URI="your_mongodb_connection_string" -e JWT_SECRET="your_super_secret_jwt_key" <tu-usuario-dockerhub>/<nombre-proyecto>:1.0.0
    ```
    The application will be available at `http://localhost:3000`.

## Resources
