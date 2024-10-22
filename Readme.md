# User Authentication Microservice

## Overview

This microservice handles user authentication using **JWT (JSON Web Tokens)**. It provides basic authentication functionality, including user login and token generation. The service is built using **Node.js** and **TypeScript** and interacts with a **MongoDB** database for user data storage and retrieval.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Available Scripts](#available-scripts)
6. [Project Structure](#project-structure)
7. [Environment Variables](#environment-variables)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **User Registration & Login**: Allows users to register and authenticate with email and password.
- **Password Hashing**: Uses **bcrypt** for secure password storage.
- **JWT Authentication**: Issues JWT tokens upon successful authentication, enabling secure stateless sessions.
- **MongoDB Integration**: Stores user data in a MongoDB database using **Mongoose**.
- **TypeScript**: Written in TypeScript for type safety and better development experience.

## Prerequisites

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or cloud-based, such as [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for package management

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ifaizmohd/auth-service.git
   ```

2. Navigate to the project directory:

   ```bash
   cd user-auth-service
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   Alternatively, use yarn:

   ```bash
   yarn install
   ```

4. Create a `.env` file in the root of your project and set the necessary environment variables (see the [Environment Variables](#environment-variables) section for details).

## Running the Application

### Development Mode

To run the application in development mode with automatic reloading (using **nodemon**):

```bash
npm run start:dev
```

This will start the server on `http://localhost:3000` by default. You can modify the port in your environment variables.

### Production Mode

To build and run the application in production mode:

```bash
npm run build
npm start
```

The build command will compile TypeScript files to JavaScript, and the start command will run the compiled code.

## Available Scripts

- **`npm run start:dev`**: Runs the application in development mode using `nodemon` and `ts-node`.
- **`npm run build`**: Compiles TypeScript files into JavaScript.
- **`npm start`**: Runs the compiled JavaScript code in production mode.
- **`npm test`**: Placeholder for future test scripts.

## Project Structure

```bash
user-auth-service/
├── dist/               # Compiled JavaScript code (after build)
├── src/                # TypeScript source code
│   ├── controllers/    # Handles HTTP request logic
│   ├── middlewares/    # Middleware functions (e.g., authentication checks)
│   ├── models/         # Mongoose models (e.g., User schema)
│   ├── routes/         # Route definitions for authentication APIs
│   └── server.ts       # Entry point of the application
├── tests/              # Test files (if added)
├── .env                # Environment variables (not included in repo)
├── package.json        # Project metadata and dependencies
└── README.md           # Documentation
```

## Environment Variables

Create a `.env` file in the root directory and configure the following environment variables:

```bash
PORT=3000              # Port number the server will run on
MONGO_URI=mongodb://localhost:27017/auth-db  # MongoDB connection string
JWT_SECRET=your_jwt_secret  # Secret key used for signing JWT tokens
```

- **PORT**: The port on which the server listens (default: 3000).
- **MONGO_URI**: The URI for your MongoDB instance.
- **JWT_SECRET**: Secret key for signing JWT tokens (keep this secure and private).

## Contributing

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

```

This README template provides a clear structure and instructions for your **User Authentication Microservice** using JWT and Node.js.
```
