<!--
Hey, thanks for using the awesome-readme-template template.  
If you have any enhancements, then fork this project and create a pull request 
or just open an issue with the label "enhancement".

Don't forget to give this project a star for additional support ;)
Maybe you can mention me or this repo in the acknowledgements too
-->
<div align="center">

  <h1>Express-Typescript-Boilerplate</h1>
  
  <p>
    A simple Express.js boilerplate server with typescript
  </p>
  
  
<!-- Badges -->
<p>
  <a href="https://github.com/Louis3797/awesome-readme-template/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/Louis3797/awesome-readme-template" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/Louis3797/express-ts-boilerplate" alt="last update" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-boilerplate/network/members">
    <img src="https://img.shields.io/github/forks/Louis3797/express-ts-boilerplate" alt="forks" />
  </a>
  <a href="https://github.com/Louis3797/awesome-readme-template/stargazers">
    <img src="https://img.shields.io/github/stars/Louis3797/express-ts-boilerplate" alt="stars" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-boilerplate/issues/">
    <img src="https://img.shields.io/github/issues/Louis3797/express-ts-boilerplate" alt="open issues" />
  </a>
  <a href="https://github.com/Louis3797/express-ts-boilerplate/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/Louis3797/express-ts-boilerplate.svg" alt="license" />
  </a>
</p>
   
<h4>
    <a href="https://github.com/Louis3797/express-ts-boilerplate">Documentation</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-boilerplate/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/Louis3797/express-ts-boilerplate/issues/">Request Feature</a>
  </h4>
</div>

<br />

<!-- Table of Contents -->
# Table of Contents

- [About the Project](#about-the-project)
  * [Tech Stack](#tech-stack)
  * [Features](#features)
  * [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Linting](#linting)
  * [Running Tests](#running-tests)
  * [Run Locally](#run-locally)
  * [Run with Docker](#run-with-docker)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)
  

<!-- About the Project -->
## About the Project

<!-- TechStack -->
### Tech Stack

- ***Express.js***
- ***Typescript***
- ***Yarn***


<!-- Features -->
### Features

- ***Package managament*** with Yarn
- ***Testing*** with Jest and Supertest
- ***Cross-Origin Resource-Sharing*** enabled using cors
- ***Secured HTTP Headers*** using helmet
- ***Logging*** with winston
- ***Environment variables*** using dotenv
- ***Compression*** with gzip
- ***Git hooks*** with husky and lint-staged
- ***Linting and enforced code style*** using Eslint and Prettier
- ***Containerization*** with Docker


<!-- Env Variables -->
### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`

`PORT`

`CORS_ORIGIN`

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
  git clone https://github.com/Louis3797/express-ts-boilerplate.git
```

Go to the project directory

```bash
  cd express-ts-boilerplate
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
  yarn code:check

  # fix prettier errors
  yarn code:format
  
  # fix prettier errors in specific file
  yarn code:format:specific-file <file-name>
```
   
<!-- Running Tests -->
### Running Tests

To run tests, run the following command

```bash
  yarn test
```

<!-- Run Locally -->
### Run Locally

Start the server in development mode

```bash
  yarn dev
```

Start the server in production mode

```bash
  yarn start
```

<!-- Run with Docker -->
### Run with Docker

Build the container

```bash
  cd express-ts-boilerplate
  docker build . -t express-ts-boilerplate     
```

Start the container

```bash
  docker run -p <port you want the container to run at>:4040 -d express-ts-boilerplate    
```


<!-- License -->
## License

Distributed under the MIT License. See LICENSE.txt for more information.


<!-- Contact -->
## Contact

Louis-Kaan Ay

Project Link: [https://github.com/Louis3797/express-ts-boilerplate](https://github.com/Louis3797/express-ts-boilerplate)


<!-- Acknowledgments -->
## Acknowledgements

 - [Readme Template](https://github.com/Louis3797/awesome-readme-template)
