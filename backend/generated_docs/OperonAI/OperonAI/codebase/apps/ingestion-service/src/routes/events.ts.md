**Ingestion Service Events Routes Documentation**
=====================================================

**Overview**
------------

The `events.ts` file in the `apps/ingestion-service/src/routes` directory defines two Fastify routes for ingesting events into the system. These routes are responsible for processing incoming event payloads, normalizing them, and storing them in a buffer for further processing.

**Functions/Classes**
--------------------

### `registerEventsRoutes`

Registers two Fastify routes for ingesting events into the system.

**Signature**
```typescript
export const registerEventsRoutes = (
  fastify: FastifyInstance,
  buffer: Buffer
) => { ... }
```

**Parameters**

* `fastify`: The Fastify instance to register the routes on.
* `buffer`: The buffer to store ingested events in.

**Return Value**

None.

**Usage Example**
```typescript
import { registerEventsRoutes } from './events';

const fastify = new Fastify();
const buffer = new Buffer();

registerEventsRoutes(fastify, buffer);
```

### `ingestEventBodySchema` and `ingestEventsBulkBodySchema`

These are two JSON schema definitions for validating incoming event payloads.

**Signature**
```typescript
import { ingestEventBodySchema, ingestEventsBulkBodySchema } from '../schemas/events';
```

**Parameters**

None.

**Return Value**

The JSON schema definitions.

**Usage Example**
```typescript
import { ingestEventBodySchema } from '../schemas/events';

const payload = {
  // event payload data
};

const isValid = ingestEventBodySchema.validate(payload);
if (!isValid) {
  console.error('Invalid payload');
}
```

### `normalizeEvent`

Normalizes an event payload by applying business logic and transformations.

**Signature**
```typescript
import { normalizeEvent } from '../normalizer/index.js';
```

**Parameters**

* `orgId`: The ID of the organization the event belongs to.
* `payload`: The event payload to normalize.

**Return Value**

The normalized event payload.

**Usage Example**
```typescript
import { normalizeEvent } from '../normalizer/index.js';

const orgId = 'org-123';
const payload = {
  // event payload data
};

const normalizedPayload = normalizeEvent(orgId, payload);
console.log(normalizedPayload);
```

### `push` (Buffer method)

Adds an event to the buffer.

**Signature**
```typescript
buffer.push(event: RawEvent): void
```

**Parameters**

* `event`: The event to add to the buffer.

**Return Value**

None.

**Usage Example**
```typescript
import { Buffer } from '../buffer/index.js';

const buffer = new Buffer();
const event = {
  // event data
};

buffer.push(event);
```

**Dependencies**
----------------

### `@operonai/types`

This module provides type definitions for the `IngestEventPayload` and `RawEvent` types.

**Why used**

The `@operonai/types` module is used to ensure type safety and consistency throughout the codebase.

### `fastify`

Fastify is a fast and low-latency web framework for Node.js.

**Why used**

Fastify is used to create the routes for ingesting events into the system.

### `../normalizer/index.js`

This module provides the `normalizeEvent` function for normalizing event payloads.

**Why used**

The `../normalizer/index.js` module is used to apply business logic and transformations to incoming event payloads.

### `../buffer/index.js`

This module provides the `Buffer` class for storing ingested events.

**Why used**

The `../buffer/index.js` module is used to store ingested events in a buffer for further processing.

### `crypto`

The `crypto` module provides functions for generating random UUIDs.

**Why used**

The `crypto` module is used to generate unique IDs for ingested events.

**Usage Examples**
-----------------

### Ingesting a single event

```typescript
import { registerEventsRoutes } from './events';

const fastify = new Fastify();
const buffer = new Buffer();

registerEventsRoutes(fastify, buffer);

const payload = {
  // event payload data
};

fastify.post('/ingest/events', {
  body: payload,
})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Ingesting multiple events in bulk

```typescript
import { registerEventsRoutes } from './events';

const fastify = new Fastify();
const buffer = new Buffer();

registerEventsRoutes(fastify, buffer);

const payloads = [
  {
    // event payload data
  },
  {
    // event payload data
  },
];

fastify.post('/ingest/events/bulk', {
  body: { events: payloads },
})
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
```

**Edge Cases & Warnings**
-------------------------

### Invalid payload

If the incoming payload is invalid, the `ingestEventBodySchema` or `ingestEventsBulkBodySchema` will reject it. In this case, the route will return a 400 Bad Request response with an error message.

### Buffer overflow

If the buffer is full and a new event is added, the oldest event will be removed to make room for the new one. This is a normal behavior, but it's worth noting that events may be lost if the buffer is not properly managed.

### Event ID collision

If two events have the same ID, the second event will overwrite the first one. This is a normal behavior, but it's worth noting that events may be lost if the ID is not properly generated.

### Error handling

Error handling is crucial when working with events. Make sure to handle errors properly and return meaningful error messages to the client.