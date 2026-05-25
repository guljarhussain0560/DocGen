**Type Definitions for Fastify Request**
=====================================

### Overview

This module, located in `apps/api/src/types.d.ts`, extends the `FastifyRequest` interface to include a `tenant` property of type `Tenant`. This allows for easy access to the current tenant within Fastify requests. The `Tenant` type is imported from the `@hookrelay/db` package, which is part of the project's database package.

### Functions/Classes

There are no functions or classes defined in this module. Instead, it uses the `declare module` syntax to extend the `FastifyRequest` interface.

* `declare module "fastify"`: This syntax is used to extend the `fastify` module.
* `interface FastifyRequest`: This interface is extended to include a `tenant` property.
* `tenant: Tenant;`: This property is added to the `FastifyRequest` interface, allowing access to the current tenant.

### Dependencies

* `@hookrelay/db`: This package is imported to use the `Tenant` type. The `@hookrelay/db` package is part of the project's database package and provides type definitions for database-related entities.

### Usage Examples

To use this extended `FastifyRequest` interface, you can access the `tenant` property within a Fastify route handler:
```typescript
import { FastifyRequest } from 'fastify';

const routeHandler = async (request: FastifyRequest) => {
  const tenant = request.tenant;
  // Use the tenant object as needed
};
```

### Edge Cases & Warnings

* Make sure to install the `@hookrelay/db` package and import it correctly to use the `Tenant` type.
* This module assumes that the `tenant` property is set on the `FastifyRequest` object before accessing it. If this property is not set, it will be `undefined`.
* Be aware that this module uses the `declare module` syntax, which is a TypeScript feature. This syntax may not work as expected in JavaScript files or with certain TypeScript configurations.

Example of setting the `tenant` property on the `FastifyRequest` object:
```typescript
import { FastifyRequest } from 'fastify';

const onRequest = async (request: FastifyRequest, reply: FastifyReply) => {
  const tenant = getTenantFromDatabase(); // Replace with actual logic to get the tenant
  request.tenant = tenant;
};

const fastify = Fastify();
fastify.addHook('onRequest', onRequest);
```
In this example, the `onRequest` hook is used to set the `tenant` property on the `FastifyRequest` object before the route handler is called.