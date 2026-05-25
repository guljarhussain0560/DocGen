**Ingestion Service Logs Module**
================================

**Overview**
------------

The `logs` module is part of the Ingestion Service, responsible for handling log ingestion requests. It provides a single endpoint for ingesting logs, which are then stored in a buffer for further processing. This module is designed to work in conjunction with the `normalizer` and `buffer` modules to ensure efficient and reliable log ingestion.

**Functions/Classes**
--------------------

### `registerLogsRoutes`

Registers the log ingestion endpoint with the Fastify instance.

**Signature**
```typescript
export const registerLogsRoutes = (
  fastify: FastifyInstance,
  buffer: Buffer
) => { ... }
```

**Parameters**

* `fastify`: The Fastify instance to register the endpoint with.
* `buffer`: The buffer to store ingested logs in.

**Return Value**

None.

**Usage Example**
```typescript
import { registerLogsRoutes } from './logs';

const fastify = new Fastify();
const buffer = new Buffer();

registerLogsRoutes(fastify, buffer);

fastify.listen(3000, () => {
  console.log('Server listening on port 3000');
});
```

### `ingestLogBodySchema`

The schema for the log ingestion request body.

**Signature**
```typescript
import { ingestLogBodySchema } from '../schemas/logs';
```

**Return Value**

The schema object.

**Usage Example**
```typescript
import { ingestLogBodySchema } from '../schemas/logs';

const schema = ingestLogBodySchema;
console.log(schema);
```

**Dependencies**
----------------

### `FastifyInstance`

The Fastify instance to register the endpoint with.

* Imported from: `fastify`
* Used for: Registering the log ingestion endpoint.

### `Buffer`

The buffer to store ingested logs in.

* Imported from: `../buffer/index.js`
* Used for: Storing ingested logs.

### `normalizeLog`

The function to normalize log data.

* Imported from: `../normalizer/index.js`
* Used for: Normalizing log data before storing it in the buffer.

### `crypto`

The crypto module for generating random UUIDs.

* Imported implicitly
* Used for: Generating random UUIDs for ingested logs.

### `IngestLogPayload` and `RawEvent`

Types for the log ingestion request body and the ingested log event.

* Imported from: `@operonai/types`
* Used for: Type checking and validation.

**Usage Examples**
-----------------

### Ingesting Logs

To ingest logs, send a POST request to the `/ingest/logs` endpoint with the log data in the request body.
```bash
curl -X POST \
  http://localhost:3000/ingest/logs \
  -H 'Content-Type: application/json' \
  -d '{"org": {"id": "org-123"}, "log": {"message": "Hello, world!"}}'
```
This will ingest the log and store it in the buffer.

### Retrieving Ingested Logs

To retrieve the ingested logs, you can use the `buffer` object to access the stored events.
```typescript
const events = buffer.getEvents();
console.log(events);
```
This will log the ingested events to the console.

**Edge Cases & Warnings**
-------------------------

### Log Normalization

The `normalizeLog` function is used to normalize log data before storing it in the buffer. If the log data is not normalized correctly, it may cause issues with the buffer or downstream processing.

### Buffer Overflow

If the buffer is not properly configured or if the ingestion rate is too high, it may cause a buffer overflow. This can lead to data loss or corruption.

### Security

Make sure to validate and sanitize the log data before ingesting it to prevent security vulnerabilities.

### Error Handling

Implement proper error handling mechanisms to handle any errors that may occur during log ingestion or buffer operations.