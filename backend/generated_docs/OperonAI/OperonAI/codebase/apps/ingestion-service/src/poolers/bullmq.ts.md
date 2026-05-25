**BullMQ Poller Module**
=======================

**Overview**
------------

The BullMQ Poller module is a part of the ingestion service responsible for monitoring BullMQ queues and sending events to the buffer when certain conditions are met. It periodically checks the depth of each queue and sends events when the queue depth exceeds a specified threshold or when a high number of jobs fail.

**Functions/Classes**
--------------------

### `createBullMQPoller` Function

#### Signature

```typescript
export const createBullMQPoller = (opts: BullMQPollerOptions) => {
  // ...
}
```

#### Parameters

* `opts`: `BullMQPollerOptions` object containing configuration options for the poller.

#### Return Value

* An object with `start`, `stop`, and `poll` methods.

#### Usage Example

```typescript
import { createBullMQPoller } from './bullmq';

const poller = createBullMQPoller({
  redis: redisClient,
  buffer: bufferInstance,
  logger: loggerInstance,
  intervalMs: 15000,
  queueDepthThreshold: 1000,
  queues: ['investigations', 'notifications', 'emails'],
});

poller.start();
```

### `start` Method

#### Signature

```typescript
const start = (): void => {
  // ...
}
```

#### Parameters

* None

#### Return Value

* None

#### Usage Example

```typescript
poller.start();
```

### `stop` Method

#### Signature

```typescript
const stop = (): void => {
  // ...
}
```

#### Parameters

* None

#### Return Value

* None

#### Usage Example

```typescript
poller.stop();
```

### `poll` Method

#### Signature

```typescript
const poll = async (): Promise<void> => {
  // ...
}
```

#### Parameters

* None

#### Return Value

* A promise that resolves when all queues have been polled.

#### Usage Example

```typescript
await poller.poll();
```

### `pollQueue` Function

#### Signature

```typescript
const pollQueue = async (queueName: string): Promise<void> => {
  // ...
}
```

#### Parameters

* `queueName`: The name of the queue to poll.

#### Return Value

* None

#### Usage Example

```typescript
await pollQueue('investigations');
```

**Dependencies**
----------------

### `@operonai/lib`

* Imported for `Logger` and `IORedis` types.

### `@operonai/types`

* Imported for `RawEvent` type.

### `../buffer`

* Imported for `Buffer` type.

**Usage Examples**
------------------

### Real-World Example

```typescript
import { createBullMQPoller } from './bullmq';

const poller = createBullMQPoller({
  redis: redisClient,
  buffer: bufferInstance,
  logger: loggerInstance,
  intervalMs: 15000,
  queueDepthThreshold: 1000,
  queues: ['investigations', 'notifications', 'emails'],
});

poller.start();

// Later, when you want to stop the poller
poller.stop();
```

**Edge Cases & Warnings**
-------------------------

### Gotchas

* Make sure to set the `intervalMs` option to a reasonable value to avoid overwhelming the buffer with events.
* Be aware that the `queueDepthThreshold` option is used to determine when to send events, so adjust it according to your needs.
* If you're using a large number of queues, consider increasing the `intervalMs` option to avoid overwhelming the buffer.

### Known Limitations

* This module assumes that the BullMQ queues are properly configured and that the Redis client is connected.
* If the Redis client is disconnected, the poller will continue to run but will not send events.

### Things to Watch Out For

* Make sure to handle errors properly when using the `poll` method.
* Be aware that the `pollQueue` function returns a promise that resolves when the queue has been polled, but it may not be the most efficient way to handle errors.