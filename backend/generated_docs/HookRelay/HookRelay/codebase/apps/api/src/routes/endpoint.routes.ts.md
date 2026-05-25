Endpoint Routes Documentation
==========================

### Overview

The `endpoint.routes.ts` file defines the API routes for managing endpoints in the system. It provides functionality for creating, reading, updating, and deleting endpoints, as well as handling authentication and validation. This module plays a crucial role in the system by providing a centralized interface for managing endpoints, which are used to receive and process events.

### Functions/Classes

#### `endpointRoutes` Function

*   **Signature:** `async (app: FastifyInstance): Promise<void>`
*   **Parameters:**
    *   `app`: An instance of the Fastify application
*   **Return Value:** A promise that resolves when the routes have been registered
*   **Usage Example:**

```typescript
import { endpointRoutes } from "./endpoint.routes";
import { FastifyInstance } from "fastify";

const app: FastifyInstance = // create a Fastify instance
await endpointRoutes(app);
```

This function registers the endpoint routes with the Fastify application.

#### Route Handlers

The following route handlers are defined in this module:

*   **GET /endpoints**: Retrieves a list of endpoints for the authenticated tenant
*   **POST /endpoints**: Creates a new endpoint for the authenticated tenant
*   **PATCH /endpoints/:id**: Updates an existing endpoint
*   **DELETE /endpoints/:id**: Deletes an existing endpoint

Each route handler has its own set of parameters, return values, and usage examples, which are described below:

##### GET /endpoints

*   **Parameters:** None
*   **Return Value:** A list of endpoints for the authenticated tenant
*   **Usage Example:**

```typescript
// Assuming the endpointRoutes function has been called to register the routes
app.inject({
  method: "GET",
  url: "/endpoints",
}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.body); // List of endpoints
  }
});
```

##### POST /endpoints

*   **Parameters:**
    *   `url`: The URL of the endpoint
    *   `eventTypeFilter`: An optional array of event types to filter
    *   `customHeaders`: An optional object of custom headers
*   **Return Value:** The created endpoint with a secret key
*   **Usage Example:**

```typescript
// Assuming the endpointRoutes function has been called to register the routes
app.inject({
  method: "POST",
  url: "/endpoints",
  body: {
    url: "https://example.com/endpoint",
    eventTypeFilter: ["event1", "event2"],
    customHeaders: {
      "Content-Type": "application/json",
    },
  },
}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.body); // Created endpoint with secret key
  }
});
```

##### PATCH /endpoints/:id

*   **Parameters:**
    *   `id`: The ID of the endpoint to update
    *   `url`: The updated URL of the endpoint
    *   `eventTypeFilter`: An optional array of event types to filter
    *   `customHeaders`: An optional object of custom headers
    *   `status`: The updated status of the endpoint (active or paused)
*   **Return Value:** The updated endpoint
*   **Usage Example:**

```typescript
// Assuming the endpointRoutes function has been called to register the routes
app.inject({
  method: "PATCH",
  url: "/endpoints/123",
  body: {
    url: "https://example.com/updated-endpoint",
    eventTypeFilter: ["event3", "event4"],
    customHeaders: {
      "Content-Type": "application/json",
    },
    status: "paused",
  },
}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.body); // Updated endpoint
  }
});
```

##### DELETE /endpoints/:id

*   **Parameters:**
    *   `id`: The ID of the endpoint to delete
*   **Return Value:** A confirmation of deletion
*   **Usage Example:**

```typescript
// Assuming the endpointRoutes function has been called to register the routes
app.inject({
  method: "DELETE",
  url: "/endpoints/123",
}, (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.body); // Deletion confirmation
  }
});
```

### Dependencies

The following external dependencies are used in this module:

*   `fastify`: The Fastify framework for building the API
*   `@hookrelay/db`: The database package for interacting with the database
*   `@hookrelay/services`: The services package for interacting with the services
*   `crypto`: The crypto package for generating random bytes
*   `../middleware/auth`: The authentication middleware for handling authentication
*   `../lib/response`: The response library for handling responses

These dependencies are used to provide the necessary functionality for managing endpoints, handling authentication and validation, and interacting with the database and services.

### Usage Examples

The following code example demonstrates how to use the `endpointRoutes` function to register the endpoint routes with a Fastify application:

```typescript
import { endpointRoutes } from "./endpoint.routes";
import { FastifyInstance } from "fastify";

const app: FastifyInstance = // create a Fastify instance
await endpointRoutes(app);

// Start the server
app.listen(3000, (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("Server listening on port 3000");
  }
});
```

### Edge Cases & Warnings

The following edge cases and warnings should be considered when using this module:

*   **Authentication**: The `tenantAuth` middleware is used to handle authentication for the endpoint routes. If the authentication fails, a 401 error will be returned.
*   **Validation**: The `schema` option is used to validate the request body for the `POST /endpoints` and `PATCH /endpoints/:id` routes. If the validation fails, a 400 error will be returned.
*   **Database errors**: If a database error occurs while interacting with the database, a 500 error will be returned.
*   **Service errors**: If a service error occurs while interacting with the services, a 500 error will be returned.
*   **Secret key management**: The secret key for an endpoint is generated randomly and returned in the response body when creating a new endpoint. It is the responsibility of the client to store the secret key safely, as it will not be shown again.
*   **Endpoint status**: The `status` field of an endpoint can be either "active" or "paused". If an endpoint is paused, it will not receive events.