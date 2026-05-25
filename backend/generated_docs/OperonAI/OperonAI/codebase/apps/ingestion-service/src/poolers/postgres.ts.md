**Postgres Poller Module**
==========================

**Overview**
------------

The Postgres Poller module is a part of the ingestion service responsible for monitoring Postgres databases for slow queries and connection pool exhaustion. It periodically queries the `pg_stat_activity` view to gather information about running queries and connection usage. The module emits events to the buffer when slow queries or connection pool exhaustion is detected.

**Functions/Classes**
---------------------

### `createPostgresPoller(opts: PostgresPollerOptions)`

Creates a Postgres poller instance.

**Signature**
```typescript
export const createPostgresPoller = (opts: PostgresPollerOptions) => {
  // ...
}
```

**Parameters**

* `opts`: An object containing the poller options.
	+ `db`: A Postgres database instance.
	+ `buffer`: A buffer instance to store events.
	+ `logger`: A logger instance for logging events.
	+ `intervalMs`: The interval in milliseconds between polls (optional, defaults to `config.poller.postgresIntervalMs`).
	+ `slowQueryThresholdMs`: The slow query threshold in milliseconds (optional, defaults to `config.poller.slowQueryThresholdMs`).

**Return Value**

An object with the following methods:

* `start()`: Starts the poller.
* `stop()`: Stops the poller.
* `poll()`: Polls the Postgres database for slow queries and connection pool exhaustion.

**Usage Example**
```typescript
const poller = createPostgresPoller({
  db: dbInstance,
  buffer: bufferInstance,
  logger: loggerInstance,
  intervalMs: 10000,
  slowQueryThresholdMs: 5000,
});

poller.start();
```

### `pollSlowQueries()`

Polls the Postgres database for slow queries.

**Signature**
```typescript
const pollSlowQueries = async (): Promise<void> => {
  // ...
}
```

**Return Value**

A promise that resolves when the poll is complete.

**Usage Example**
```typescript
poller.pollSlowQueries().then(() => {
  console.log('Slow queries polled');
}).catch((err) => {
  console.error('Error polling slow queries:', err);
});
```

### `pollConnectionPool()`

Polls the Postgres database for connection pool exhaustion.

**Signature**
```typescript
const pollConnectionPool = async (): Promise<void> => {
  // ...
}
```

**Return Value**

A promise that resolves when the poll is complete.

**Usage Example**
```typescript
poller.pollConnectionPool().then(() => {
  console.log('Connection pool polled');
}).catch((err) => {
  console.error('Error polling connection pool:', err);
});
```

### `poll()`

Polls the Postgres database for slow queries and connection pool exhaustion.

**Signature**
```typescript
const poll = async (): Promise<void> => {
  // ...
}
```

**Return Value**

A promise that resolves when the poll is complete.

**Usage Example**
```typescript
poller.poll().then(() => {
  console.log('Poll complete');
}).catch((err) => {
  console.error('Error polling:', err);
});
```

### `start()`

Starts the poller.

**Signature**
```typescript
const start = (): void => {
  // ...
}
```

**Return Value**

None.

**Usage Example**
```typescript
poller.start();
```

### `stop()`

Stops the poller.

**Signature**
```typescript
const stop = (): void => {
  // ...
}
```

**Return Value**

None.

**Usage Example**
```typescript
poller.stop();
```

**Dependencies**
----------------

* `@operonai/types`: Provides the `RawEvent` type.
* `@operonai/lib`: Provides the `Logger` type.
* `@operonai/db`: Provides the `Database` type and the `sql` function.
* `../buffer`: Provides the `Buffer` type.
* `../config`: Provides the `config` object.

**Usage Examples**
------------------

### Real-world example

```typescript
const poller = createPostgresPoller({
  db: dbInstance,
  buffer: bufferInstance,
  logger: loggerInstance,
  intervalMs: 10000,
  slowQueryThresholdMs: 5000,
});

poller.start();

// Later, when you want to stop the poller
poller.stop();
```

### Edge Cases & Warnings
---------------------------

* Make sure to handle errors properly when using the poller.
* The `slowQueryThresholdMs` option should be set to a reasonable value based on your Postgres database's performance.
* The `intervalMs` option should be set to a reasonable value based on your monitoring needs.
* The `maxConnections` value should be set to the actual maximum number of connections allowed by your Postgres database.
* The `poller` instance should be properly stopped when it's no longer needed to avoid memory leaks.