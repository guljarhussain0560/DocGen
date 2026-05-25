# Project Overview
## Tech Stack & Architecture Style
The project utilizes a microservices architecture, with multiple applications and packages working together. The primary programming languages used are **TypeScript** and **JavaScript**. The main frameworks employed are:
* **Fastify** for the API
* **Next.js** for the web application
* **BullMQ** for the worker

The project also uses various libraries, including:
* **React** and **React Query** for the web application
* **Drizzle ORM** and **Zod** for database interactions and validation
* **Dotenv** for environment variable management
* **ESLint** and **Prettier** for code linting and formatting

The design patterns used include:
* **Modular architecture**, with separate packages for configuration, database, and services
* **Dependency injection**, with dependencies managed through the `package.json` files
* **Event-driven architecture**, with events handled by the worker and API

## Directory Breakdown
The directory tree is organized into several key modules:
* **apps**: Contains the main applications, including the API, web application, and worker
	+ **api**: API application, with routes, middleware, and server configuration
	+ **web**: Web application, with pages, components, and layout
	+ **worker**: Worker application, with tasks and event handling
* **packages**: Contains reusable packages, including:
	+ **config**: Configuration package, with environment variable management and validation
	+ **db**: Database package, with database interactions and schema management
	+ **lib**: Library package, with utility functions and helpers
	+ **queue**: Queue package, with message queue management and task handling
	+ **services**: Services package, with business logic and API interactions
	+ **types**: Types package, with type definitions and interfaces
	+ **typescript-config**: TypeScript configuration package, with compiler options and settings

## Core Entrypoints
The application starts with the following entrypoints:
* **apps/api/src/main.ts**: API entrypoint, with server configuration and route handling
* **apps/web/app/(auth)/login/page.tsx**: Web application entrypoint, with login page and authentication handling
* **apps/worker/src/main.ts**: Worker entrypoint, with task handling and event processing

Files import each other using ES6 imports, with dependencies managed through the `package.json` files. The main entrypoints import and configure the necessary dependencies, including frameworks, libraries, and packages.

## Setup & Dependencies Summary
To run the project, the following environment variables and dependencies are required:
* **Node.js**: Version 18 or higher
* **pnpm**: Version 9.0.0 or higher
* **TypeScript**: Version 5.9.2 or higher
* **Fastify**: Version 5.8.5 or higher
* **Next.js**: Version 16.1.7 or higher
* **BullMQ**: Version 5.74.1 or higher
* **React**: Version 19.2.4 or higher
* **React Query**: Version 5.100.9 or higher
* **Drizzle ORM**: Version 0.45.2 or higher
* **Zod**: Version 4.3.6 or higher
* **Dotenv**: Version 17.4.2 or higher

The project uses a monorepo structure, with dependencies managed through the `package.json` files. The `turbo` script is used to manage and run the applications, with scripts defined in the `package.json` files.