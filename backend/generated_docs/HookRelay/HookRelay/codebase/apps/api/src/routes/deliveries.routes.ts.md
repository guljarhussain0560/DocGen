**Deliveries Routes Documentation**
=====================================

### 1. Overview

The `deliveries.routes.ts` file defines routes for managing deliveries within the API application. It provides endpoints for retrieving deliveries by tenant, fetching a specific delivery by ID, and retrieving attempts made for a delivery. This module plays a crucial role in the system by handling delivery-related requests and ensuring that only authorized tenants can access their respective deliveries.

### 2. Functions/Classes

#### `deliveriesRoutes` Function

```typescript
export const deliveriesRoutes = async (app: FastifyInstance): Promise<void> => { ... }
```

*   **Signature:** `async (app: FastifyInstance): Promise<void>`
*   **Parameters:**
    *   `app`: An instance of `FastifyInstance`, which represents the Fastify application.
*   **Return Value:** `Promise<void>` indicating the completion of the route setup.
*   **Usage Example:**

    ```typescript
import { deliveriesRoutes } from "./deliveries.routes";
import { FastifyInstance } from "fastify";

const app: FastifyInstance = /* initialize Fastify app */;
await deliveriesRoutes(app);
```

#### Route Handlers

The `deliveriesRoutes` function sets up three route handlers:

*   **GET /deliveries**

    *   **Purpose:** Retrieve deliveries for the authenticated tenant.
    *   **Parameters:**
        *   `status`: Optional query parameter to filter deliveries by status (pending, success, or failed).
        *   `limit`: Optional query parameter to specify the maximum number of deliveries to return (default: 20).
        *   `offset`: Optional query parameter to specify the offset for pagination (default: 0).
    *   **Return Value:** A JSON response containing an array of deliveries.

    ```typescript
app.get(
  "/deliveries",
  {
    preHandler: [tenantAuth],
    schema: {
      querystring: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["pending", "success", "failed"] },
          limit: { type: "number", minimum: 1, maximum: 100, default: 20 },
          offset: { type: "number", minimum: 0, default: 0 },
        },
      },
    },
  },
  async (request, reply) => { ... }
);
```

*   **GET /deliveries/:id**

    *   **Purpose:** Retrieve a specific delivery by ID.
    *   **Parameters:**
        *   `id`: The ID of the delivery to retrieve.
    *   **Return Value:** A JSON response containing the delivery object.

    ```typescript
app.get(
  "/deliveries/:id",
  {
    preHandler: [tenantAuth],
  },
  async (request, reply) => { ... }
);
```

*   **GET /deliveries/:id/attempts**

    *   **Purpose:** Retrieve attempts made for a specific delivery.
    *   **Parameters:**
        *   `id`: The ID of the delivery for which to retrieve attempts.
    *   **Return Value:** A JSON response containing an array of attempts.

    ```typescript
app.get(
  "/deliveries/:id/attempts",
  {
    preHandler: [tenantAuth],
  },
  async (request, reply) => { ... }
);
```

### 3. Dependencies

The `deliveries.routes.ts` file imports the following external dependencies:

*   `FastifyInstance` from `fastify`: Represents the Fastify application instance.
*   `tenantAuth` from `../middleware/auth`: A middleware function for authenticating tenants.
*   `findDeliveriesByTenant`, `findDeliveryById`, and `findAttemptsByDeliveryId` from `@hookrelay/db`: Database functions for retrieving deliveries and attempts.
*   `sendSuccess` and `sendError` from `../lib/response`: Utility functions for sending HTTP responses.

These dependencies are used to handle authentication, database interactions, and response handling.

### 4. Usage Examples

Here are some examples of how to use the routes defined in this module:

*   **Retrieve deliveries for the authenticated tenant:**

    ```bash
GET /deliveries?status=pending&limit=10&offset=0
```

*   **Retrieve a specific delivery by ID:**

    ```bash
GET /deliveries/12345
```

*   **Retrieve attempts made for a specific delivery:**

    ```bash
GET /deliveries/12345/attempts
```

### 5. Edge Cases & Warnings

*   **Authentication:** The `tenantAuth` middleware is used to authenticate tenants for all routes. If authentication fails, a 401 Unauthorized response will be sent.
*   **Delivery not found:** If a delivery is not found for a given ID, a 404 Not Found response will be sent.
*   **Invalid query parameters:** If invalid query parameters are provided (e.g., invalid status or limit), a 400 Bad Request response will be sent.
*   **Database errors:** If database errors occur during query execution, a 500 Internal Server Error response will be sent.

Developers should be aware of these edge cases and handle them accordingly in their application code.