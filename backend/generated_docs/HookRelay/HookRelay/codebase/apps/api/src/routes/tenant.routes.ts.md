**Tenant Routes Documentation**
================================

### 1. Overview

The `tenant.routes.ts` file is a part of the API application and defines routes for managing tenants. It provides a single endpoint for creating new tenants. This module plays a crucial role in the system by allowing users to create and manage their own tenants, which are essential for the microservices architecture.

### 2. Functions/Classes

#### `tenantRoutes` Function

* **Signature:** `export const tenantRoutes = async (app: FastifyInstance): Promise<void> => { ... }`
* **Parameters:**
	+ `app`: An instance of `FastifyInstance`, which is the Fastify application.
* **Return Value:** A promise that resolves to `void`.
* **Usage Example:**
```typescript
import { tenantRoutes } from './tenant.routes';
import { FastifyInstance } from 'fastify';

const app: FastifyInstance = // initialize Fastify app
await tenantRoutes(app);
```

#### `createTenant` Function (imported from `@hookrelay/db`)

* **Signature:** `createTenant(options: { userId: string; name: string; apiKeyHash: string; rateLimitPerMin: number }): Promise<Tenant>`
* **Parameters:**
	+ `options`: An object containing the tenant's details.
		- `userId`: The ID of the user creating the tenant.
		- `name`: The name of the tenant.
		- `apiKeyHash`: The hashed API key for the tenant.
		- `rateLimitPerMin`: The rate limit per minute for the tenant.
* **Return Value:** A promise that resolves to the created `Tenant` object.
* **Usage Example:**
```typescript
import { createTenant } from '@hookrelay/db';

const tenant = await createTenant({
  userId: 'user-123',
  name: 'My Tenant',
  apiKeyHash: 'hashed-api-key',
  rateLimitPerMin: 1000,
});
```

#### `hashApiKey` Function (imported from `../lib/crypto`)

* **Signature:** `hashApiKey(apiKey: string): string`
* **Parameters:**
	+ `apiKey`: The API key to be hashed.
* **Return Value:** The hashed API key.
* **Usage Example:**
```typescript
import { hashApiKey } from '../lib/crypto';

const apiKey = 'my-api-key';
const hashedApiKey = hashApiKey(apiKey);
```

#### `generateApiKey` Function (imported from `../lib/crypto`)

* **Signature:** `generateApiKey(): string`
* **Return Value:** A randomly generated API key.
* **Usage Example:**
```typescript
import { generateApiKey } from '../lib/crypto';

const apiKey = generateApiKey();
```

#### `sendSuccess` Function (imported from `../lib/response`)

* **Signature:** `sendSuccess(reply: FastifyReply, data: any, statusCode: number): void`
* **Parameters:**
	+ `reply`: The Fastify reply object.
	+ `data`: The data to be sent in the response.
	+ `statusCode`: The HTTP status code for the response.
* **Return Value:** `void`
* **Usage Example:**
```typescript
import { sendSuccess } from '../lib/response';

sendSuccess(reply, { message: 'Success' }, 201);
```

### 3. Dependencies

* `fastify`: The Fastify framework is used to create the API application.
* `@hookrelay/db`: The `createTenant` function is imported from this module, which provides database interactions.
* `../lib/crypto`: The `hashApiKey` and `generateApiKey` functions are imported from this module, which provides cryptographic utilities.
* `../lib/response`: The `sendSuccess` function is imported from this module, which provides response helpers.

### 4. Usage Examples

To create a new tenant, send a POST request to the `/tenants` endpoint with the required data:
```bash
curl -X POST \
  http://localhost:3000/tenants \
  -H 'Content-Type: application/json' \
  -d '{"userId": "user-123", "name": "My Tenant"}'
```
This will create a new tenant and return the tenant's details, including the API key.

### 5. Edge Cases & Warnings

* The `createTenant` function will throw an error if the `userId` or `name` is missing or invalid.
* The `hashApiKey` function will throw an error if the `apiKey` is missing or invalid.
* The `generateApiKey` function will return a random API key, but it's recommended to store this key securely, as it will not be shown again.
* The `sendSuccess` function will throw an error if the `reply` object is missing or invalid.
* The `tenantRoutes` function will throw an error if the `app` instance is missing or invalid.

When using this module, make sure to handle errors properly and validate user input to prevent potential security vulnerabilities. Additionally, ensure that the API key is stored securely to prevent unauthorized access to the tenant's resources.