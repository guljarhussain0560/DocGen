**Crypto Module Documentation**
================================

### Overview

The `crypto.ts` module, located in `apps/api/src/lib/crypto.ts`, provides utility functions for generating and hashing API keys. This module plays a crucial role in the system by ensuring the secure generation and verification of API keys, which are used for authentication and authorization purposes.

### Functions/Classes

#### `hashApiKey(apiKey: string): string`

* **Signature:** `hashApiKey(apiKey: string): string`
* **Parameters:**
	+ `apiKey`: The API key to be hashed (type: `string`)
* **Return Value:** A SHA-256 hashed version of the input API key (type: `string`)
* **Usage Example:**
```typescript
import { hashApiKey } from './crypto';

const apiKey = 'my_secret_api_key';
const hashedApiKey = hashApiKey(apiKey);
console.log(hashedApiKey); // Output: a SHA-256 hashed string
```

#### `generateApiKey(): string`

* **Signature:** `generateApiKey(): string`
* **Parameters:** None
* **Return Value:** A randomly generated API key in the format `wh_live_<random_hex_string>` (type: `string`)
* **Usage Example:**
```typescript
import { generateApiKey } from './crypto';

const newApiKey = generateApiKey();
console.log(newApiKey); // Output: a randomly generated API key (e.g., "wh_live_1234567890abcdef")
```

### Dependencies

The `crypto.ts` module imports the following external dependencies:

* `createHash` and `randomBytes` from the `crypto` module (a built-in Node.js module)
	+ Used for generating SHA-256 hashes and random byte sequences, respectively.

### Usage Examples

Here are some real-world code examples demonstrating how to use the `crypto` module:

```typescript
// Generate a new API key and hash it
import { generateApiKey, hashApiKey } from './crypto';

const newApiKey = generateApiKey();
const hashedApiKey = hashApiKey(newApiKey);

// Store the hashed API key in a database or secure storage
console.log(hashedApiKey);

// Later, when verifying an API key...
const inputApiKey = 'wh_live_1234567890abcdef';
const expectedHashedApiKey = hashApiKey(inputApiKey);

if (expectedHashedApiKey === storedHashedApiKey) {
  console.log('API key is valid');
} else {
  console.log('API key is invalid');
}
```

### Edge Cases & Warnings

* **Collision attacks:** Although extremely unlikely, it is theoretically possible for two different API keys to produce the same SHA-256 hash (a collision). To mitigate this risk, use a sufficient work factor (e.g., iteration count) when generating hashes, and consider using a more secure hashing algorithm like Argon2 or PBKDF2.
* **Randomness quality:** The `randomBytes` function generates cryptographically secure random numbers. However, if the system's entropy pool is depleted, the generated random numbers may not be as secure. Ensure that your system has a sufficient entropy pool, and consider using a hardware random number generator (HRNG) if possible.
* **Key storage:** Always store API keys securely, using a secrets manager or a secure storage mechanism, such as an encrypted database or a Hardware Security Module (HSM). Never hardcode or store API keys in plain text.