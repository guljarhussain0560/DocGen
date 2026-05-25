**API Server Entry Point Documentation**
=====================================

### 1. Overview

The `main.ts` file is the entry point of the API server application. It is responsible for initializing the server, setting up event listeners, and handling shutdown signals. This module plays a crucial role in the system by providing the main entry point for the API server, which handles incoming requests and interacts with other microservices.

### 2. Functions/Classes

#### `start` Function

```typescript
const start = async (): Promise<void> => { ... }
```

* **Signature:** `async (): Promise<void>`
* **Parameters:** None
* **Return Value:** `Promise<void>`
* **Description:** The `start` function is the main entry point of the API server. It initializes the server, sets up event listeners, and handles shutdown signals.
* **Usage Example:**

```typescript
start().catch((err) => {
  logger.error({ err }, "Failed to start API server");
  process.exit(1);
});
```

#### `shutdown` Function

```typescript
const shutdown = async (signal: string): Promise<void> => { ... }
```

* **Signature:** `async (signal: string): Promise<void>`
* **Parameters:**
	+ `signal`: The shutdown signal received (e.g., "SIGTERM" or "SIGINT")
* **Return Value:** `Promise<void>`
* **Description:** The `shutdown` function is called when a shutdown signal is received. It closes the server, disconnects from Redis, and exits the process.
* **Usage Example:**

```typescript
process.on("SIGTERM", () => shutdown("SIGTERM"));
```

### 3. Dependencies

The `main.ts` file imports the following external dependencies:

* `buildServer` from `./server`: This function builds and returns the API server instance.
* `config` from `@hookrelay/config`: This module provides environment variable management and validation.
* `logger` from `@hookrelay/lib`: This module provides logging functionality.
* `disconnectRedis` from `@hookrelay/lib`: This function disconnects from the Redis instance.

These dependencies are used to:

* Initialize the API server
* Manage environment variables and configuration
* Log important events and errors
* Disconnect from Redis during shutdown

### 4. Usage Examples

To use this module, simply call the `start` function:

```typescript
import { start } from "./main";

start().catch((err) => {
  logger.error({ err }, "Failed to start API server");
  process.exit(1);
});
```

You can also use the `shutdown` function to handle shutdown signals:

```typescript
process.on("SIGTERM", () => shutdown("SIGTERM"));
```

### 5. Edge Cases & Warnings

* **Unhandled Rejections:** The `unhandledRejection` event is caught and logged, but it will still cause the process to exit with a non-zero status code. Make sure to handle all promises and errors properly to avoid this.
* **Shutdown Signals:** The `shutdown` function is called when a shutdown signal is received. However, if the server is not properly closed, it may not shut down cleanly. Make sure to handle shutdown signals properly and close the server instance.
* **Redis Connection:** The `disconnectRedis` function is called during shutdown to disconnect from Redis. However, if the Redis connection is not properly closed, it may cause issues. Make sure to handle Redis connections properly and close them during shutdown.