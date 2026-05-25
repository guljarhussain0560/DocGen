**Error Handler Middleware Documentation**
==============================================

### 1. Overview

The `error-handler.ts` file contains a middleware function for handling errors in the Fastify API application. This module plays a crucial role in the system by catching and processing unhandled errors, providing a standardized error response to clients, and logging error details for debugging purposes.

### 2. Functions/Classes

#### `errorHandler` function

* **Signature:** `(error: FastifyError, request: FastifyRequest, reply: FastifyReply): void`
* **Parameters:**
	+ `error`: The error object thrown by the application, which is an instance of `FastifyError`.
	+ `request`: The incoming request object, which is an instance of `FastifyRequest`.
	+ `reply`: The response object, which is an instance of `FastifyReply`.
* **Return Value:** `void`
* **Usage Example:**
```typescript
import { errorHandler } from './error-handler';

// Assuming you have a Fastify instance and a route that throws an error
fastify.get('/example', async (request, reply) => {
  throw new Error('Example error');
});

// Register the error handler middleware
fastify.setErrorHandler(errorHandler);
```

### 3. Dependencies

* **`fastify`**: The Fastify framework is used to define the error handler middleware function, which is compatible with Fastify's error handling mechanism.
* **`@hookrelay/lib`**: The `logger` function is imported from `@hookrelay/lib` to log error details for debugging purposes.

### 4. Usage Examples

#### Registering the Error Handler Middleware

To use the `errorHandler` function, you need to register it as an error handler middleware in your Fastify application:
```typescript
import fastify from 'fastify';
import { errorHandler } from './error-handler';

const app = fastify();

// Register the error handler middleware
app.setErrorHandler(errorHandler);

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

#### Throwing an Error in a Route

To test the error handler middleware, you can throw an error in a route:
```typescript
app.get('/example', async (request, reply) => {
  throw new Error('Example error');
});
```

When you make a request to the `/example` route, the error handler middleware will catch the error and return a standardized error response.

### 5. Edge Cases & Warnings

* **Validation Errors**: If the error object has a `validation` property, the error handler middleware will return a 400 Bad Request response with a `VALIDATION_ERROR` code. Otherwise, it will return a 500 Internal Server Error response with an `INTERNAL_ERROR` code.
* **Error Logging**: The error handler middleware logs error details using the `logger` function from `@hookrelay/lib`. Make sure to configure the logger properly to avoid logging sensitive information.
* **Custom Error Handling**: If you need to handle specific errors differently, you can modify the error handler middleware to suit your requirements. However, be cautious when overriding the default error handling behavior to avoid introducing security vulnerabilities.