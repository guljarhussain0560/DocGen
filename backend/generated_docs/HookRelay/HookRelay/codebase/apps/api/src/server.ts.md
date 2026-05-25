**API Server Documentation**
==========================

### 1. Overview

The `server.ts` file is the main entry point for the API application. It sets up a Fastify server with various routes and middleware to handle incoming requests. This module is responsible for creating and configuring the API server, which is a crucial component of the microservices architecture.

### 2. Functions/Classes

#### `buildServer` Function

```typescript
export const buildServer = async () => {
  // ...
}
```

* **Signature:** `async () => Promise<FastifyInstance>`
* **Parameters:** None
* **Return Value:** A Promise that resolves to a configured Fastify instance
* **Usage Example:**

```typescript
import { buildServer } from './server';

const app = await buildServer();
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

This function creates a new Fastify instance with custom configuration options, sets up error handling, and registers various routes. It returns a Promise that resolves to the configured server instance.

### 3. Dependencies

The following external dependencies are used in this module:

* **Fastify**: A fast and low-latency web framework for Node.js
* **@hookrelay/config**: A package for managing environment variables and configuration
* **@hookrelay/lib**: A package containing utility functions and helpers
* **./middleware/error-handler**: A custom error handling middleware
* **./routes/***: Various route handlers for different API endpoints

These dependencies are used to create a robust and scalable API server with features like error handling, logging, and route management.

### 4. Usage Examples

Here's an example of how to use the `buildServer` function to create and start a server:

```typescript
import { buildServer } from './server';

const app = await buildServer();
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

You can also use the `buildServer` function to create a server instance and then use it to handle requests programmatically:

```typescript
import { buildServer } from './server';
import { Request, Response } from 'fastify';

const app = await buildServer();

app.inject({
  method: 'GET',
  url: '/health',
}, (err, res: Response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.body);
  }
});
```

### 5. Edge Cases & Warnings

* **Error Handling:** The `errorHandler` middleware is used to catch and handle errors that occur during request processing. However, it's essential to ensure that the error handling logic is properly implemented to avoid masking critical errors.
* **Route Registration:** The `buildServer` function registers various routes using the `app.register()` method. If a route is not properly registered, it may not be accessible or may cause errors.
* **Server Configuration:** The Fastify instance is created with custom configuration options, such as `logger: false` and `trustProxy: true`. These options may need to be adjusted depending on the specific use case or deployment environment.
* **Dependency Management:** The module uses various external dependencies, which must be properly managed and updated to ensure compatibility and security.