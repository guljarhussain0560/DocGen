**Event Routes Documentation**
================================

### 1. Overview

The `event.routes.ts` file is a part of the API application and is responsible for handling event-related routes. Specifically, it defines a single route for ingesting events, which is a critical component of the event-driven architecture used in the project. This module plays a crucial role in the system by providing a standardized way of handling events from various sources.

### 2. Functions/Classes

#### `eventsRoutes` Function

```typescript
export const eventsRoutes = async (app: FastifyInstance): Promise<void> => { ... }
```

*   **Signature:** `async (app: FastifyInstance): Promise<void>`
*   **Parameters:**
    *   `app`: An instance of `FastifyInstance`, which is the main application object.
*   **Return Value:** `Promise<void>` - The function returns a promise that resolves to `void`, indicating that it doesn't return any specific value.
*   **Usage Example:**

    ```typescript
import { eventsRoutes } from "./event.routes";
import { FastifyInstance } from "fastify";

const app: FastifyInstance = /* initialize Fastify app */;
await eventsRoutes(app);
```

#### `ingestEvent` Function (Imported from `@hookrelay/services`)

```typescript
const result = await ingestEvent({
  tenantId: request.tenant.id,
  eventType,
  payload,
  idempotencyKey,
});
```

*   **Signature:** `async (options: { tenantId: string, eventType: string, payload: Record<string, unknown>, idempotencyKey: string }): Promise<{ eventId: string, duplicate: boolean }>`
*   **Parameters:**
    *   `options`: An object containing the event details, including `tenantId`, `eventType`, `payload`, and `idempotencyKey`.
*   **Return Value:** `Promise<{ eventId: string, duplicate: boolean }>`

#### `sendSuccess` Function (Imported from `../lib/response`)

```typescript
return sendSuccess(reply, {
  eventId: result.eventId,
  duplicate: result.duplicate,
  status: "accepted",
}, result.duplicate ? 200 : 202);
```

*   **Signature:** `async (reply: FastifyReply, data: object, statusCode: number): void`
*   **Parameters:**
    *   `reply`: The Fastify reply object.
    *   `data`: The response data.
    *   `statusCode`: The HTTP status code for the response.
*   **Return Value:** `void`

### 3. Dependencies

The `event.routes.ts` file imports the following external dependencies:

*   `FastifyInstance` from `fastify`: The main application object.
*   `tenantAuth` from `../middleware/auth`: Middleware for authenticating tenants.
*   `rateLimitMiddleware` from `../middleware/rate-limit`: Middleware for rate limiting.
*   `ingestEvent` from `@hookrelay/services`: A function for ingesting events.
*   `sendSuccess` from `../lib/response`: A function for sending a successful response.

These dependencies are used to handle authentication, rate limiting, event ingestion, and response sending.

### 4. Usage Examples

Here's an example of how to use the `eventsRoutes` function:

```typescript
import { eventsRoutes } from "./event.routes";
import { FastifyInstance } from "fastify";

const app: FastifyInstance = /* initialize Fastify app */;
await eventsRoutes(app);

// Example event ingestion
app.inject({
  method: "POST",
  url: "/events",
  payload: {
    eventType: "example-event",
    payload: { key: "value" },
    idempotencyKey: "example-idempotency-key",
  },
}, (err, response) => {
  if (err) {
    console.error(err);
  } else {
    console.log(response.body);
  }
});
```

### 5. Edge Cases & Warnings

*   **Event Validation:** The `ingestEvent` function expects the event payload to conform to a specific schema. If the payload is invalid, the function may throw an error or return an error response.
*   **Rate Limiting:** The `rateLimitMiddleware` middleware is used to limit the number of requests from a single tenant. If the rate limit is exceeded, the middleware will return an error response.
*   **Idempotency:** The `ingestEvent` function uses the `idempotencyKey` to ensure that duplicate events are not ingested. If an event with the same `idempotencyKey` is ingested multiple times, the function will return a duplicate response.
*   **Error Handling:** The `eventsRoutes` function does not handle errors explicitly. It relies on the `ingestEvent` function and the `sendSuccess` function to handle errors and return error responses. If an error occurs during event ingestion or response sending, the error will be propagated to the caller.