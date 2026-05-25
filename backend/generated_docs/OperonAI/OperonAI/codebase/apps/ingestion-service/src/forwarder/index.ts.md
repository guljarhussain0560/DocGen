**Forwarder Module Documentation**
=====================================

**Overview**
------------

The `forwarder` module is responsible for ingesting raw events from various sources, persisting them to a database, and analyzing them using the Anomaly Service. This module plays a crucial role in the system by ensuring that events are properly processed and analyzed, enabling the system to make informed decisions.

**Functions/Classes**
--------------------

### `createForwarder(opts: ForwarderOptions)`

Creates a forwarder instance with the given options.

**Signature**
```typescript
export const createForwarder = (opts: ForwarderOptions) => {
  // ...
}
```

**Parameters**

* `opts`: `ForwarderOptions` object containing the database and logger instances.

**Return Value**

* A `Forwarder` object with a `forwardBatch` method.

**Usage Example**
```typescript
import { createForwarder } from './forwarder';

const db = new Database();
const logger = new Logger();
const forwarder = createForwarder({ db, logger });
```

### `groupByOrg(events: RawEvent[])`

Groups raw events by organization ID.

**Signature**
```typescript
const groupByOrg = (events: RawEvent[]): Record<string, RawEvent[]> =>
  // ...
```

**Parameters**

* `events`: An array of `RawEvent` objects.

**Return Value**

* An object with organization IDs as keys and arrays of raw events as values.

**Usage Example**
```typescript
const events = [
  { orgId: 'org1', id: 'event1' },
  { orgId: 'org1', id: 'event2' },
  { orgId: 'org2', id: 'event3' },
];

const groupedEvents = groupByOrg(events);
console.log(groupedEvents); // { org1: [ { orgId: 'org1', id: 'event1' }, { orgId: 'org1', id: 'event2' } ], org2: [ { orgId: 'org2', id: 'event3' } ] }
```

### `persistEvents(events: RawEvent[])`

Persists raw events to the database.

**Signature**
```typescript
const persistEvents = async (events: RawEvent[]): Promise<void> => {
  // ...
}
```

**Parameters**

* `events`: An array of `RawEvent` objects.

**Return Value**

* A promise that resolves when the events are persisted.

**Usage Example**
```typescript
const events = [
  { orgId: 'org1', id: 'event1' },
  { orgId: 'org1', id: 'event2' },
];

await persistEvents(events);
```

### `analyzeEvents(events: RawEvent[])`

Analyzes raw events using the Anomaly Service.

**Signature**
```typescript
const analyzeEvents = async (events: RawEvent[]): Promise<void> => {
  // ...
}
```

**Parameters**

* `events`: An array of `RawEvent` objects.

**Return Value**

* A promise that resolves when the events are analyzed.

**Usage Example**
```typescript
const events = [
  { orgId: 'org1', id: 'event1' },
  { orgId: 'org1', id: 'event2' },
];

await analyzeEvents(events);
```

### `forwardBatch(events: RawEvent[])`

Forwards a batch of raw events to the Anomaly Service.

**Signature**
```typescript
const forwardBatch = async (events: RawEvent[]): Promise<void> => {
  // ...
}
```

**Parameters**

* `events`: An array of `RawEvent` objects.

**Return Value**

* A promise that resolves when the batch is forwarded.

**Usage Example**
```typescript
const events = [
  { orgId: 'org1', id: 'event1' },
  { orgId: 'org1', id: 'event2' },
];

await forwardBatch(events);
```

**Dependencies**
----------------

### `@operonai/lib`

Provides the `createHttpClient` function for creating an HTTP client instance.

### `@operonai/types`

Defines the `RawEvent`, `AnalyzeBatchRequest`, and `AnalyzeBatchResponse` types.

### `@operonai/db`

Provides the `Database` class and `insertRawEvents` function for interacting with the database.

### `../config`

Provides the `config` object with Anomaly Service URL and timeout settings.

**Usage Examples**
-----------------

### Creating a Forwarder Instance
```typescript
import { createForwarder } from './forwarder';

const db = new Database();
const logger = new Logger();
const forwarder = createForwarder({ db, logger });
```

### Forwarding a Batch of Events
```typescript
const events = [
  { orgId: 'org1', id: 'event1' },
  { orgId: 'org1', id: 'event2' },
];

await forwarder.forwardBatch(events);
```

**Edge Cases & Warnings**
-------------------------

### Anomaly Service Unreachable

If the Anomaly Service is unreachable, the `analyzeEvents` function will log a warning and skip analysis for the affected organization.

### Database Errors

If a database error occurs during event persistence, the `persistEvents` function will log an error and continue processing other events.

### Event Validation

Ensure that raw events are properly validated before forwarding them to the Anomaly Service.