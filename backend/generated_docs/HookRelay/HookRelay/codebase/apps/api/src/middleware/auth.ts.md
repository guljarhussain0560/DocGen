**Authentication Middleware Documentation**
==============================================

### 1. Overview

The `auth.ts` file, located in the `apps/api/src/middleware` directory, provides authentication middleware functions for the API application. These functions are responsible for verifying the authenticity of incoming requests by checking API keys and admin keys. The module plays a crucial role in securing the API by ensuring that only authorized requests are processed.

### 2. Functions/Classes

#### `tenantAuth` Function

* **Signature:** `async (request: FastifyRequest, reply: FastifyReply): Promise<void>`
* **Parameters:**
	+ `request`: The incoming Fastify request object.
	+ `reply`: The Fastify reply object.
* **Return Value:** `Promise<void>` (no explicit return value, but may throw errors or send responses)
* **Usage Example:**
```typescript
import { tenantAuth } from './auth';

// Assuming 'request' and 'reply' are valid Fastify request and reply objects
tenantAuth(request, reply).catch((error) => {
  console.error(error);
});
```
The `tenantAuth` function checks the `x-api-key` header in the request and verifies its validity by hashing the key and checking it against a cached or database-stored value. If the key is valid, it sets the `request.tenant` property with the corresponding tenant data.

#### `adminAuth` Function

* **Signature:** `async (request: FastifyRequest, reply: FastifyReply): Promise<void>`
* **Parameters:**
	+ `request`: The incoming Fastify request object.
	+ `reply`: The Fastify reply object.
* **Return Value:** `Promise<void>` (no explicit return value, but may throw errors or send responses)
* **Usage Example:**
```typescript
import { adminAuth } from './auth';

// Assuming 'request' and 'reply' are valid Fastify request and reply objects
adminAuth(request, reply).catch((error) => {
  console.error(error);
});
```
The `adminAuth` function checks the `x-admin-key` header in the request and verifies its validity by comparing it to a configured admin secret. If the key is valid, it allows the request to proceed.

### 3. Dependencies

The `auth.ts` file imports the following external dependencies:

* `@hookrelay/db`: Provides the `findTenantByApiKeyHash` function for database interactions.
* `@hookrelay/config`: Exports the `config` object, which contains the admin secret.
* `@hookrelay/lib`: Provides utility functions, including `redis` for caching and `hashApiKey` for hashing API keys.
* `fastify`: Provides the `FastifyRequest` and `FastifyReply` types.

These dependencies are used to interact with the database, cache, and configuration, as well as to handle requests and responses.

### 4. Usage Examples

To use the `tenantAuth` function, you can add it as a middleware to your Fastify route:
```typescript
import { FastifyInstance } from 'fastify';
import { tenantAuth } from './auth';

const server: FastifyInstance = fastify();

server.get('/protected', {
  preValidation: tenantAuth,
}, (request, reply) => {
  // Only executed if the request is authenticated
  reply.send({ message: 'Hello, authenticated user!' });
});
```
Similarly, you can use the `adminAuth` function to protect admin-only routes:
```typescript
import { FastifyInstance } from 'fastify';
import { adminAuth } from './auth';

const server: FastifyInstance = fastify();

server.get('/admin-only', {
  preValidation: adminAuth,
}, (request, reply) => {
  // Only executed if the request is authenticated with the admin key
  reply.send({ message: 'Hello, admin!' });
});
```
### 5. Edge Cases & Warnings

* **Cache invalidation:** The `tenantAuth` function uses a cache to store tenant data. If the cache is not properly invalidated, it may lead to stale data being used. Make sure to update the cache when tenant data changes.
* **Admin secret security:** The `adminAuth` function uses a configured admin secret. Ensure that this secret is kept secure and not exposed to unauthorized parties.
* **Error handling:** The `tenantAuth` and `adminAuth` functions may throw errors or send error responses. Make sure to handle these errors properly in your application.
* **API key validation:** The `tenantAuth` function checks the `x-api-key` header, but it does not validate the key's format or content. Ensure that the API key is properly validated and sanitized before using it.