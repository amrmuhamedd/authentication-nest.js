# Authentication REST API Documentation

## Introduction

Welcome to the Authentication REST API documentation. This API allows users to register, log in, logout, and list protected posts.


## Tech Stack

The Authentication REST API is built using the following technologies:

- **Nest.js**: A fast and minimalist web framework for Node.js.
- **MongoDB**: nosql database.
- **JWT (JSON Web Tokens)**: For secure authentication and authorization.
- **Swagger**: For API documentation.
- **Bcrypt**: For hashing and securing user passwords.
- **Class-Validator & Class-Transformer**: Used for request validation and data transformation.
- **Mongoose**: ODM for MongoDB to structure and manage database interactions.



Features

- User Registration: Securely create an account with hashed passwords.
- User Login: Authenticate users and issue access & refresh tokens.
- Token Refreshing: Refresh expired access tokens using refresh tokens.
- User Logout: Securely invalidate refresh tokens upon logout.
- Protected Routes: Access control based on authentication status.


## Getting Started

Follow these instructions to run the project locally using Node js:

1. Clone the project repository to your local machine:

   ```bash
   git clone <repository_url>
   cd <project_directory>
   ```

1. Create a .env file in the project root and configure the following environment variables:

```bash
DATABASE_URL= mongo db server url
JWT_SECRET= secret for access token
RT_SECRET=  secret for refresh token
```

2. install debndaceis

```bash
yarn install
```

4. Start the development server:

```bash
yarn start:dev
```

Now you can see your API docs at: `http://localhost:port or 3000/docs/#/`

## live preview

you can see the live preview [https://authentication-nest-js.vercel.app/docs](https://authentication-nest-js.vercel.app/docs) . Please note that the initial launch of the documentation may be a bit slow as it is hosted on a free hosting plan.

## Front end

repo : [https://github.com/amrmuhamedd/authentication-react](https://github.com/amrmuhamedd/authentication-react)
live preview: [https://authentication-react-ecru.vercel.app/login](https://authentication-react-ecru.vercel.app/login)

## At the end

Please refer to the Swagger documentation for detailed information on each endpoint and how to use them.

If you have any questions or encounter issues, feel free to reach out for assistance. Happy coding!
