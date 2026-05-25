**User Route Module**
=====================

**Overview**
------------

The `userroute.js` module defines routes for user-related operations in the application. It handles user registration, book purchasing, and retrieving purchased books. This module is a crucial part of the system, enabling users to interact with the application.

**Functions/Classes**
---------------------

### `router.post("/signup")`

* **Signature:** `router.post("/signup", (req, res) => { ... })`
* **Parameters:** `req` (request object), `res` (response object)
* **Return Value:** `res.json({ msg: "User created successfully" })`
* **Usage Example:**
```javascript
const express = require("express");
const router = require("./userroute");

const app = express();
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
This route handles user registration by creating a new user document in the database.

### `router.get("/books")`

* **Signature:** `router.get("/books", async (req, res) => { ... })`
* **Parameters:** `req` (request object), `res` (response object)
* **Return Value:** `res.json({ books })`
* **Usage Example:**
```javascript
const express = require("express");
const router = require("./userroute");

const app = express();
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
This route retrieves all books present in the database.

### `router.post("/books/:bookId")`

* **Signature:** `router.post("/books/:bookId", userMiddleware, async (req, res) => { ... })`
* **Parameters:** `req` (request object), `res` (response object), `bookId` (book ID parameter)
* **Return Value:** `res.json({ msg: "Purched Complete" })`
* **Usage Example:**
```javascript
const express = require("express");
const router = require("./userroute");

const app = express();
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
This route purchases a book by updating the user's document in the database.

### `router.get("/purchedbooks")`

* **Signature:** `router.get("/purchedbooks", userMiddleware, async (req, res) => { ... })`
* **Parameters:** `req` (request object), `res` (response object)
* **Return Value:** `res.json({ books })`
* **Usage Example:**
```javascript
const express = require("express");
const router = require("./userroute");

const app = express();
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
This route retrieves the purchased books details for the authenticated user.

**Dependencies**
----------------

* `express`: The Express.js framework is used to define routes and handle requests.
* `userMiddleware`: The user middleware is used to authenticate users and authorize access to certain routes.
* `User` and `Books`: The Mongoose models for users and books are used to interact with the database.

**Usage Examples**
------------------

To use this module, simply require it in your Express.js application and use the defined routes:
```javascript
const express = require("express");
const router = require("./userroute");

const app = express();
app.use(router);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
```
**Edge Cases & Warnings**
-------------------------

* Make sure to authenticate users before accessing routes that require authentication (e.g., `router.post("/books/:bookId")` and `router.get("/purchedbooks")`).
* Be aware that this module uses Mongoose models to interact with the database. Make sure to handle errors and exceptions properly.
* This module assumes that the `userMiddleware` is properly configured and authenticated users. Make sure to implement proper authentication and authorization mechanisms.