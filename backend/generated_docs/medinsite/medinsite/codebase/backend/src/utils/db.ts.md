**Database Connection Utility Module**
=====================================

### 1. Overview

The `db.ts` module, located in the `backend/src/utils/` directory, is responsible for establishing a connection to the MongoDB database using Mongoose. This module plays a crucial role in the system by providing a centralized way to manage database connections, ensuring that the application can interact with the database seamlessly.

### 2. Functions/Classes

#### `connectDB()`

* **Signature:** `async connectDB(): Promise<void>`
* **Parameters:** None
* **Return Value:** `Promise<void>` (resolves when the connection is established or rejects with an error)
* **Usage Example:**
```typescript
import connectDB from './db';

async function main() {
  try {
    await connectDB();
    console.log('Database connection established');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

main();
```
The `connectDB` function attempts to connect to the MongoDB database using the `DATABASE_URI` environment variable. If the connection is successful, it logs a success message to the console. If the connection fails, it logs an error message and exits the process with a failure code.

### 3. Dependencies

* **`mongoose`**: The Mongoose library is used to interact with the MongoDB database. It provides a convenient way to define schemas, models, and perform CRUD operations.
* **`dotenv`**: The `dotenv` library is used to load environment variables from a `.env` file. In this case, it's used to retrieve the `DATABASE_URI` environment variable.

### 4. Usage Examples

To use the `connectDB` function, simply import it and call it in your application's entry point (e.g., `index.ts`):
```typescript
import connectDB from './utils/db';

async function main() {
  await connectDB();
  // Start the Express.js server or perform other initialization tasks
}

main();
```
Alternatively, you can use the `connectDB` function in a specific route or controller to establish a connection to the database on demand:
```typescript
import connectDB from '../utils/db';
import express from 'express';

const router = express.Router();

router.get('/example', async (req, res) => {
  try {
    await connectDB();
    // Perform database operations or retrieve data
    res.json({ message: 'Database connection established' });
  } catch (error) {
    console.error('Error connecting to database:', error);
    res.status(500).json({ message: 'Error connecting to database' });
  }
});
```
### 5. Edge Cases & Warnings

* **Missing `DATABASE_URI` environment variable**: If the `DATABASE_URI` environment variable is not defined in the `.env` file, the `connectDB` function will log an error message and exit the process with a failure code.
* **Connection failures**: If the connection to the database fails, the `connectDB` function will log an error message and exit the process with a failure code. You should handle connection failures and errors accordingly in your application.
* **Mongoose version compatibility**: Ensure that the Mongoose version used in your project is compatible with the MongoDB version you're connecting to. Incompatible versions may lead to connection issues or errors.
* **Database connection pooling**: Mongoose uses connection pooling by default. If you're experiencing issues with connection pooling, you may need to adjust the pool size or disable pooling altogether.