**Project Overview**
======================

### Tech Stack & Architecture Style

* **Primary Programming Languages:** JavaScript (ES6+), HTML/CSS
* **Main Frameworks:** Node.js (Express.js), React
* **Database:** MongoDB (Mongoose ORM)
* **Libraries:**
	+ Authentication: Passport.js
	+ API Documentation: Swagger
	+ Logging: Winston
	+ Testing: Jest, Enzyme
* **Design Patterns:**
	+ Model-View-Controller (MVC) for backend
	+ Component-based architecture for frontend

### Directory Breakdown

The project directory tree is organized as follows:

```markdown
.
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── containers
│   │   ├── actions
│   │   ├── reducers
│   │   ├── utils
│   │   └── index.js
│   └── package.json
├── server
│   ├── config
│   │   ├── database.js
│   │   ├── auth.js
│   │   └── index.js
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── app.js
│   └── package.json
├── tests
│   ├── client
│   │   ├── components
│   │   ├── containers
│   │   └── utils
│   └── server
│       ├── controllers
│       ├── models
│       └── services
├── .env
├── .gitignore
├── package.json
└── README.md
```

* **Client Directory:** Contains the React application code, including components, containers, actions, reducers, and utilities.
* **Server Directory:** Contains the Node.js application code, including configuration, controllers, models, routes, services, and utilities.
* **Tests Directory:** Contains unit tests and integration tests for both client and server code.
* **Config Directory:** Contains configuration files for the server, including database and authentication settings.
* **Public Directory:** Contains static assets for the client application.

### Core Entrypoints

* **Client Entrypoint:** `client/src/index.js`
	+ Imports React and renders the application to the DOM.
	+ Imports components and containers from `client/src/components` and `client/src/containers`.
* **Server Entrypoint:** `server/app.js`
	+ Imports Express.js and sets up the server.
	+ Imports routes from `server/routes` and mounts them to the server.
	+ Imports controllers from `server/controllers` and uses them to handle requests.

### Setup & Dependencies Summary

* **Environment Variables:**
	+ `NODE_ENV`: Development or production environment.
	+ `PORT`: Server port number.
	+ `MONGO_URI`: MongoDB connection string.
	+ `JWT_SECRET`: Secret key for JSON Web Tokens.
* **Dependencies:**
	+ `express`: Node.js web framework.
	+ `react`: JavaScript library for building user interfaces.
	+ `mongodb`: NoSQL database.
	+ `mongoose`: MongoDB ORM.
	+ `passport`: Authentication middleware.
	+ `swagger`: API documentation framework.
	+ `winston`: Logging library.
	+ `jest`: Testing framework.
	+ `enzyme`: Testing utility for React components.

To run the project, install dependencies with `npm install` or `yarn install`, then start the server with `npm start` or `yarn start`. The client application will be served at `http://localhost:3000` and the server API will be available at `http://localhost:3001`.