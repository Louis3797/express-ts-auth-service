<!--
Hey, thanks for using the awesome-readme-template template.
If you have any enhancements, then fork this project and create a pull request
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <h1>Express-Ts-Auth-Service</h1>
  
  <p>
A pre-built authentication server that uses JSON Web Tokens (JWT) for authentication. It is built using Express.js, TypeScript and MySQL
  </p>
  
<!-- Badges -->
<p>
  <a href="https://github.com/Louis3797/express-ts-auth-service/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Louis3797/express-ts-auth-service" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Louis3797/express-ts-auth-service" alt="last update" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/network/members">
    <img src="https://img.shields.io/github/forks/Louis3797/express-ts-auth-service" alt="forks" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/stargazers">
    <img src="https://img.shields.io/github/stars/Louis3797/express-ts-auth-service" alt="stars" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">
    <img src="https://img.shields.io/github/issues/Louis3797/express-ts-auth-service" alt="open issues" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-auth-service/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/Louis3797/express-ts-auth-service.svg" alt="license" />
  </a>
</p>

<h4>
    <a href="https://github.com/Louis3797/express-ts-auth-service#readme">Documentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-auth-service/issues/">Request Feature</a>
  </h4>
</div>

<!-- Table of Contents -->

# Table of Contents

- [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
    - [Tech Stack](#tech-stack)
    - [Features](#features)
    - [Endpoints](#endpoints)
    - [Project Structure](#project-structure)
    - [Database](#database)
      - [Account](#account)
      - [User](#user)
      - [RefreshToken](#refreshtoken)
      - [ResetToken](#resettoken)
      - [EmailVerificationToken](#emailverificationtoken)
    - [Refresh Token Rotation](#refresh-token-rotation)
    - [Environment Variables](#environment-variables)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Linting](#linting)
    - [Running Tests](#running-tests)
    - [Run Locally](#run-locally)
    - [Run with Docker](#run-with-docker)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
    - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Contact](#contact)
  - [Acknowledgements](#acknowledgements)

<!-- About the Project -->

## About the Project

This pre-built authentication server is designed to simplify the process of adding secure user authentication to your web or mobile application. It provides a ready-made solution that uses JSON Web Tokens (JWT) to ensure reliable and secure user sessions, saving you time and resources that would otherwise be required to develop an authentication system from scratch. Built using Express.js and TypeScript, this server is also highly customizable and can be extended to meet the specific needs of your application. By integrating our authentication server into your application, you can rest assured that your users' data and sessions are well protected, leaving you free to focus on other important aspects of your application.

<!-- TechStack -->

### Tech Stack

<p align="left">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=ts,nodejs,express,mysql,docker,prisma&perline=13" />
  </a>
</p>

<!-- Features -->

### Features

- :black_nib: Written in TypeScript for type-safe code
- :floppy_disk: Utilize a MySQL database to efficiently store user data
- :speaking_head: Interacts with the database using the powerful Prisma ORM
- :lock: Implements secure authentication measures with JWTs, ensuring secure access to sensitive data
- :key: Implements robust password hashing using Argon2 for maximum security
- :recycle: Incorporates refresh token rotation functionality to enhance the security
- :white_check_mark: Includes email verification functionality for new user sign-ups
- :new: Provides a reset password function for users who have forgotten their password
- :rabbit2: Enables faster data transfer by implementing GZIP compression
- :policeman: Implements essential security features using Helmet middleware
- :cookie: Parses cookies seamlessly with cookie-parser middleware
- :gear: Allows cross-origin resource sharing using CORS
- :soap: Sanitizes request data against cross-site-scripting with xss middleware
- :capital_abcd: Manages environment variables with ease using dotenv
- :male_detective: Enforces high code quality standards with ESLint and Prettier
- :horse_racing: Implements rate limiting to prevent abuse and improve server performance
- :information_source: Accurately manages HTTP response status codes using http-status library
- :warning: Validates user input with the powerful and flexible Joi library
- :email: Facilitates sending of emails using nodemailer library
- :memo: Enables detailed logging of server activities using winston library
- :dog: Implements Git hooks with Husky to optimize development processes
- :test_tube: Ensure reliability and robustness of the application with thorough testing using Jest and Supertest

<!-- Endpoints -->

### Endpoints

```
POST /v1/auth/signup - Signup
POST /v1/auth/login - Login
POST /v1/auth/refresh - Refresh access token
POST /v1/forgot-password - Send reset password email
POST /v1/reset-password/:token - Reset password
POST /v1/send-verification-email - Send verification email
POST /v1/verify-email/:token - Verify email
```

<!-- Project Structure -->

### Project Structure

```
./src
├── config/         # Config files
├── controller/     # Route controllers
├── middleware/     # Custom middlewares
├── routes/         # Routes
├── types/          # Types
├── utils/          # Utility classes and functions
├── validations/    # Validation schemas
├── app.ts          # Express App
└── index.ts        # App Entrypoint
```

<!-- Database -->

### Database

Our server relies on MySQL as its primary database management system to store and manage all relevant data. MySQL is a popular and widely used open-source relational database system that provides efficient, secure, and scalable storage and retrieval of data.

To simplify and streamline the process of managing the data stored in the MySQL database, we utilize Prisma, which is a modern, type-safe ORM that supports various databases, including MySQL.

Prisma helps us to write database queries in a more readable and intuitive way, making it easier to manage the data stored in our MySQL database. By using Prisma as our ORM of choice, we can also ensure that our application remains scalable, efficient, and maintainable.

If you're interested in the structure of our database, you can take a look at the data model presented below, which provides an overview of the tables, columns, and relationships within the database.

```js

model Account {
  id                String   @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?  @db.Text
  access_token      String?  @db.Text
  expiresAt         DateTime
  token_type        String?
  scope             String?
  id_token          String?  @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model User {
  id                     String                   @id @default(cuid())
  name                   String
  email                  String?                  @unique
  password               String
  emailVerified          DateTime?
  createdAt              DateTime                 @default(now())
  accounts               Account[]
  refreshTokens          RefreshToken[]
  resetToken             ResetToken[]
  emailVerificationToken EmailVerificationToken[]
}

model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}

model ResetToken {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}

model EmailVerificationToken {
  id        String   @id @default(cuid())
  token     String   @unique
  expiresAt DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  createdAt DateTime @default(now())
}
```

#### Account

> Social auth is not yet implemented so that the entity can be different in the future

The Account entity represents a linked social media account for a user. It has the following fields:

- id: A unique identifier for the account.
- userId: The ID of the user associated with the account.
- type: The type of account, e.g. oauth.
- provider: The provider of the account, e.g. facebook.
- providerAccountId: The ID associated with the account from the provider's perspective.
- refresh_token: A refresh token used to obtain a new access token.
- access_token: An access token used to authenticate requests to the provider's API.
- expiresAt: The expiration time of the access token.
- token_type: The type of access token.
- scope: The scope of the access token.
- id_token: An ID token associated with the account.
- session_state: The session state of the account.

#### User

The User entity represents a user of the application. It has the following fields:

- id: A unique identifier for the user.
- name: The name of the user.
- email: The email address of the user.
- password: The password of the user.
- emailVerified: The date and time when the user's email address was verified.
- createdAt: The date of creation.
- accounts: A list of linked social media accounts for the user.
- refreshTokens: A list of refresh tokens associated with the user.
- resetToken: A list of reset tokens associated with the user.
- emailVerificationToken: A list of email verification tokens associated with the user.

#### RefreshToken

The RefreshToken entity represents a refresh token used to obtain a new access token. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- user: The user associated with the refresh token.
- userId: The ID of the user associated with the refresh token.
- createdAt: The date of creation.

#### ResetToken

The ResetToken entity represents a reset token used to reset a user's password. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- expiresAt: The expiration time of the reset token.
- user: The user associated with the reset token.
- userId: The ID of the user associated with the reset token.
- createdAt: The date of creation.

#### EmailVerificationToken

The EmailVerificationToken entity represents a token used to verify a user's email address. It has the following fields:

- id: A unique identifier for the refresh token.
- token: The token itself.
- expiresAt: The expiration time of the email verification token.
- user: The user associated with the email verification token.
- userId: The ID of the user associated with the email verification token.
- createdAt: The date of creation.

<!-- Refresh Token Rotation -->

### Refresh Token Rotation

Refresh token rotation is a security practice used to mitigate the risk of unauthorized access to a user's account or resources. When a user logs in to an application, the application issues an access token and a refresh token. The access token is used to access the user's resources, while the refresh token is used to obtain a new access token when the current one expires.

In refresh token rotation, the application periodically rotates the refresh token, meaning it invalidates the old refresh token and issues a new one. This practice can limit the amount of time an attacker can use a stolen refresh token to gain access to the user's account or resources. By rotating the refresh token, the application reduces the risk of a long-lived refresh token being used to access the user's account or resources without their permission.

![Refresh Token Rotation Flow](https://github.com/Louis3797/express-ts-auth-service/blob/main/assets/refresh_token_rotation_flow_diagram.png)

<!-- Env Variables -->

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
# App's running environment
NODE_ENV=

# App's running port
PORT=

# Server url
SERVER_URL=

# Cors origin url
CORS_ORIGIN=

# Run node -e "console.log(require('crypto').randomBytes(256).toString('base64'));" in your console to generate a secret
ACCESS_TOKEN_SECRET=

REFRESH_TOKEN_SECRET=

ACCESS_TOKEN_EXPIRE=

REFRESH_TOKEN_EXPIRE=

# name of the refresh token cookie
REFRESH_TOKEN_COOKIE_NAME=

MYSQL_DATABASE=
MYSQL_ROOT_PASSWORD=

# Example: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=

# Configuration for the emial service
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
EMAIL_FROM=
```

See .env.example for further details

<!-- Getting Started -->

## Getting Started

<!-- Prerequisites -->

### Prerequisites

This project uses Yarn as package manager

```bash
 npm install --global yarn
```

<!-- Installation -->

### Installation

```bash
  git clone https://github.com/Louis3797/express-ts-auth-service.git
```

Go to the project directory

```bash
  cd express-ts-auth-service
```

```bash
  yarn install
```

### Linting

```bash
  # run ESLint
  yarn lint

  # fix ESLint errors
  yarn lint:fix

  # run prettier
  yarn prettier:check

  # fix prettier errors
  yarn prettier:format

  # fix prettier errors in specific file
  yarn prettier:format:file <file-name>
```

<!-- Running Tests -->

### Running Tests

To run tests, run the following command

```bash
  yarn test
```

Run tests with watch flag

```bash
  yarn test:watch
```

See test coverage

```bash
  yarn coverage
```

<!-- Run Locally -->

### Run Locally

Start the server in development mode

> Note: Dont forget to define the .env variables

```bash
  yarn dev
```

Start the server in production mode

```bash
  yarn start
```

<!-- Run with Docker -->

### Run with Docker

Run docker compose

```bash
  cd express-ts-auth-service
  docker-compose up
```

<!-- Roadmap -->
## Roadmap

- [ ] Winston + morgan for logging ?
- [ ] Clean and order imports
  - [x] Order imports
  - [ ] Add index.ts files for cleaner imports
- [x] Add xss attack prevention middleware
- [ ] Add API Endpoint documentation
- [ ] Social Auth
  - [ ] Google
  - [ ] Github
  - [ ] Facebook
  - [ ] Twitter
- [ ] Better Error handeling
  - [ ] Custom Error classes like ```AccessTokenNotFoundError```
- [ ] Integration Tests

<!-- Contributing -->
## Contributing

<a href="https://github.com/Louis3797/express-ts-auth-service/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Louis3797/express-ts-auth-service" />
</a>

Contributions are always welcome!

See `CONTRIBUTING.md` for ways to get started.

<!-- Code of Conduct -->
### Code of Conduct

Please read the [Code of Conduct](https://github.com/Louis3797/express-ts-auth-service/blob/main/CODE_OF_CONDUCT.md)

<!-- License -->

## License

Distributed under the MIT License. See LICENSE for more information.

<!-- Contact -->

## Contact

Louis-Kaan Ay - louiskaan.ay@gmail.com

Project Link: [https://github.com/Louis3797/express-ts-auth-service](https://github.com/Louis3797/express-ts-auth-service)

<!-- Acknowledgments -->

## Acknowledgements

- [Readme Template](https://github.com/Louis3797/awesome-readme-template)
- [Node Express Boilerplate](https://github.com/hagopj13/node-express-boilerplate)
- [Express Ts Boilerplate](https://github.com/Louis3797/express-ts-boilerplate)
