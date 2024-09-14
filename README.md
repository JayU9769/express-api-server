# Express Prisma MySQL Server

This project is a RESTful server built using Express, Prisma, and MySQL, with TypeScript for static typing and Redis for session management. It includes various utilities and configurations for efficient development and deployment.

## Features

- **Express**: Fast and minimalist web framework for Node.js.
- **Prisma**: Modern ORM for MySQL databases.
- **TypeScript**: Strongly typed programming language that builds on JavaScript.
- **Redis**: In-memory data structure store for session management.
- **Passport**: Authentication middleware for Node.js.
- **ESLint & Prettier**: Tools for code linting and formatting.

## Prerequisites

- Node.js (v14 or later)
- MySQL database
- Redis server

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/express-prisma-mysql-server.git
   cd express-prisma-mysql-server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Configuration

1. Create a `.env` file in the root directory with the following environment variables:

   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/database"
   REDIS_URL="redis://localhost:6379"
   SECRET_KEY="your-session-secret"
   NODE_ENV="development"
   ```

   Replace `username`, `password`, `localhost`, `3306`, and `database` with your MySQL configuration.

2. Configure Prisma:

   - Modify the `src/prisma/schema.prisma` file to match your database schema.

## Scripts

- **Start the server**:

  ```bash
  npm start
  ```

- **Build the project**:

  ```bash
  npm run build
  ```

- **Start the server in development mode**:

  ```bash
  npm run dev
  ```

- **Lint the code**:

  ```bash
  npm run lint
  ```

- **Format the code**:

  ```bash
  npm run format
  ```

- **Seed the database**:

  ```bash
  npm run seed
  ```

- **Run database migrations**:

  ```bash
  npm run migrate
  ```

- **Generate Prisma client**:

  ```bash
  npm run generate
  ```

## Usage

1. **Initialize Passport**: The `PassportService` class ensures that Passport is configured and ready for authentication.

2. **Session Management**: Use the `SessionService` class to integrate Redis for session management.

3. **Run Migrations and Seeders**:

   ```bash
   npm run migrate
   npm run seed
   ```

4. **Start the Server**:

   ```bash
   npm start
   ```

## Project Structure

- **src/**: Contains source code.
  - **server.ts**: Entry point of the application.
  - **config/**: Configuration files and services.
  - **controllers/**: Business logic and route handlers.
  - **models/**: Prisma models and interfaces.
  - **middleware/**: Custom middleware functions.
  - **seeders/**: Database seeders.
  - **utils/**: Utility functions and classes.

- **dist/**: Compiled JavaScript files.

- **.env**: Environment configuration file.

- **prisma/**: Prisma schema and migration files.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am Add new feature`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)
- [Passport](http://www.passportjs.org/)
- [Redis](https://redis.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [MySQL](https://www.mysql.com/)

