Response Module Documentation
============================
### Overview

The `response.ts` module, located in `apps/api/src/lib`, provides utility functions for handling HTTP responses in the API application. It plays a crucial role in standardizing the response format and simplifying the process of sending success and error responses. This module is part of the larger microservices architecture, utilizing the Fastify framework for building the API.

### Functions/Classes

#### sendSuccess

*   **Signature:** `sendSuccess(reply: FastifyReply, data: unknown, statusCode: number): void`
*   **Parameters:**
    *   `reply`: The Fastify reply object, used to send the response.
    *   `data`: The data to be sent in the response body.
    *   `statusCode`: The HTTP status code for the response.
*   **Return Value:** `void`
*   **Usage Example:**

```typescript
import { sendSuccess } from './response';

// Assuming 'reply' is a valid Fastify reply object
sendSuccess(reply, { id: 1, name: 'John Doe' }, 200);
// Sends a response with a 200 status code and the following body:
// { success: true, data: { id: 1, name: 'John Doe' } }
```

#### sendError

*   **Signature:** `sendError(reply: FastifyReply, code: string, message: string, statusCode: number = 400): void`
*   **Parameters:**
    *   `reply`: The Fastify reply object, used to send the response.
    *   `code`: A unique error code.
    *   `message`: A human-readable error message.
    *   `statusCode`: The HTTP status code for the response (defaults to 400).
*   **Return Value:** `void`
*   **Usage Example:**

```typescript
import { sendError } from './response';

// Assuming 'reply' is a valid Fastify reply object
sendError(reply, 'INVALID_REQUEST', 'Invalid request data', 422);
// Sends a response with a 422 status code and the following body:
// { success: false, error: { code: 'INVALID_REQUEST', message: 'Invalid request data' } }
```

### Dependencies

*   `FastifyReply` from `fastify`: This import is used to type the `reply` parameter in both `sendSuccess` and `sendError` functions, ensuring that the functions are compatible with Fastify's reply object.

### Usage Examples

Here are some real-world examples demonstrating how to use the `response` module:

```typescript
import { FastifyRequest, FastifyReply } from 'fastify';
import { sendSuccess, sendError } from './response';

// Example route handler
const getUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userData = await fetchUserDataFromDatabase();
    sendSuccess(reply, userData, 200);
  } catch (error) {
    sendError(reply, 'DATABASE_ERROR', 'Failed to fetch user data', 500);
  }
};
```

### Edge Cases & Warnings

*   **Error Handling:** When using `sendError`, make sure to provide a meaningful error code and message to help with debugging and error handling.
*   **Status Code:** Be cautious when choosing the status code for `sendSuccess` and `sendError`. Ensure that it accurately reflects the nature of the response.
*   **Data Validation:** Although this module does not perform data validation, it is essential to validate the data before sending it in the response to prevent potential security vulnerabilities.
*   **Customization:** If you need to customize the response format, consider creating a new function or modifying the existing ones to fit your specific requirements. However, be mindful of the potential impact on the overall API consistency.