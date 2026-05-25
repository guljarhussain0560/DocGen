Rate Limit Middleware
======================
### Overview
The `rate-limit.ts` module provides a middleware function for rate limiting incoming requests to the API. This middleware is designed to prevent excessive requests from a single tenant within a specified time window. It utilizes Redis to store and manage the request counts.

### Functions/Classes
#### `rateLimitMiddleware`
```typescript
export const rateLimitMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => { ... }
```
* **Parameters:**
	+ `request`: The incoming Fastify request object.
	+ `reply`: The Fastify reply object.
* **Return Value:** A Promise that resolves to `void`.
* **Usage Example:**
```typescript
import { rateLimitMiddleware } from './rate-limit';

// Assuming you have a Fastify instance
fastify.addHook('preHandler', rateLimitMiddleware);
```
This middleware function checks the request's tenant and rate limit configuration. If the rate limit is exceeded, it returns a 429 response with a `Retry-After` header.

### Dependencies
* **`@hookrelay/lib`**: Provides the Redis client instance.
* **`@hookrelay/config`**: Exports the configuration object, including the rate limit window and limit per minute.
* **`../lib/response`**: Provides the `sendError` function for sending error responses.
* **`fastify`**: The Fastify framework, which provides the `FastifyRequest` and `FastifyReply` types.

### Usage Examples
To use this middleware in your Fastify application, you can add it as a hook:
```typescript
import fastify from 'fastify';
import { rateLimitMiddleware } from './rate-limit';

const app = fastify();

app.addHook('preHandler', rateLimitMiddleware);

// Your routes and other middleware go here
```
Alternatively, you can use it as a route-specific middleware:
```typescript
import fastify from 'fastify';
import { rateLimitMiddleware } from './rate-limit';

const app = fastify();

app.get('/example', { preHandler: rateLimitMiddleware }, (request, reply) => {
  // Your route handler code here
});
```
### Edge Cases & Warnings
* **Redis Connection Issues**: If the Redis connection is lost or unavailable, the rate limit middleware will fail. Make sure to handle Redis connection errors and implement a fallback strategy if necessary.
* **Tenant Configuration**: The rate limit middleware relies on the `tenant` object being present in the request. Ensure that the `tenant` object is properly set up and configured for each request.
* **Rate Limit Configuration**: The rate limit configuration is stored in the `@hookrelay/config` module. Make sure to update the configuration values accordingly to reflect the desired rate limiting behavior.
* **Lua Script Errors**: The Redis Lua script used in this middleware can potentially throw errors. Monitor your Redis logs and handle any errors that may occur during script execution.