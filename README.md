## Banking Setup

![Code Coverage](https://img.shields.io/badge/Code%20Coverage-36%25-critical?style=flat)

# Explanation

A simulation of a simple bank account was created, with three entities: User, representing the account owner, BankAccount, and the Transactions entity to control the account's transaction flow as well as its balance. Logic was implemented to update the balance in real-time when manipulating any transaction in the system.

# Technologys

- Docker
- NestJS
- NodeJs
- JestJs
- TypeORM
- Postgres
- Husky
- Libs : Prettier, Lint, Swagger

# Requirements

- Docker
- OS Preference Linux or Windows WSL Mode

# Docs

- http://localhost:3001/api

# Run Project

- Create .env from .env-local
- Run - yarn
- docker-compose build
- docker-compose up -d
- Run yarn run migrate:run - to create migrations
- Run yarn run start:dev

Import all endpoints from folder /docs to use in insomnia.

# Testing

- Only run : yarn test

# Finishing

<img width="957" alt="image" src="https://github.com/ssbreno/banking/assets/8092325/0a5290d0-e70c-464b-b63b-eda52f418d5c">
