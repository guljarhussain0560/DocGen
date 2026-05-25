Dependency & Package Analysis Guide
=====================================

### Table of Contents

1. [Third-Party Libraries Breakdown](#third-party-libraries-breakdown)
2. [Security & Version Assessment](#security-version-assessment)
3. [Environment Setup Requirements](#environment-setup-requirements)

### Third-Party Libraries Breakdown
#### Core Frameworks and Libraries

* **Next.js**: A popular React-based framework for building server-side rendered and statically generated websites.
* **Fastify**: A fast and low-latency web framework for Node.js.
* **React**: A JavaScript library for building user interfaces.
* **BullMQ**: A Node.js library for building background jobs and message queues.

#### Utilities and Development Packages

* **TypeScript**: A superset of JavaScript that adds optional static typing and other features.
* **ESBuild**: A fast and efficient JavaScript bundler and minifier.
* **Prettier**: A code formatter that automatically formats code to a consistent style.
* **Vitest**: A fast and efficient testing framework for JavaScript and TypeScript.
* **Turbo**: A build tool that allows for fast and efficient building of monorepos.

#### Dependencies by Package

* **@hookrelay/api**:
	+ **fastify**: ^5.8.5
	+ **@hookrelay/config**: workspace:*
	+ **@hookrelay/db**: workspace:*
	+ **@hookrelay/lib**: workspace:*
	+ **@hookrelay/queue**: workspace:*
	+ **@hookrelay/services**: workspace:*
* **@hookrelay/web**:
	+ **next**: 16.1.7
	+ **react**: ^19.2.4
	+ **react-dom**: ^19.2.4
	+ **@hookrelay/db**: workspace:*
	+ **@tanstack/react-query**: ^5.100.9
* **@hookrelay/worker**:
	+ **bullmq**: ^5.74.1
	+ **@hookrelay/db**: workspace:*
	+ **@hookrelay/lib**: workspace:*
	+ **@hookrelay/queue**: workspace:*
	+ **@hookrelay/services**: workspace:*

### Security & Version Assessment
#### Deprecated or Potentially Risky Packages

* **axios**: ^1.16.0 ( outdated, consider updating to latest version)
* **bcryptjs**: ^3.0.3 (consider using a more secure alternative like **bcrypt**)

#### Major Version Choices

* **Node.js**: >=18 (ensure you are using a compatible version)
* **Next.js**: 16.1.7 (ensure you are using a compatible version)

### Environment Setup Requirements
#### Installation Commands

1. Install dependencies using **pnpm**:
```bash
pnpm install
```
2. Build the project using **turbo**:
```bash
pnpm run build
```
3. Start the development server using **turbo**:
```bash
pnpm run dev
```

#### Configuration Variables

* **NODE_ENV**: set to **development** or **production** depending on the environment
* **pnpm** version: ensure you are using version **9.0.0** or later

#### Additional Setup

1. Install **ESBuild** using **pnpm**:
```bash
pnpm install esbuild@0.25.12
```
2. Configure **Prettier** to use the project's code style:
```bash
pnpm run format
```
3. Run **Vitest** to ensure all tests pass:
```bash
pnpm run test
```