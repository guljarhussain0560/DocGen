**Dependency & Package Analysis Guide**
=====================================

**Table of Contents**
-----------------

1. [Third-Party Libraries Breakdown](#third-party-libraries-breakdown)
2. [Security & Version Assessment](#security-version-assessment)
3. [Environment Setup Requirements](#environment-setup-requirements)

**Third-Party Libraries Breakdown**
---------------------------------

### Core Frameworks

* **React**: `^18.2.0` - A JavaScript library for building user interfaces.
* **Vite**: `^6.2.0` - A build tool for modern web applications.

### Libraries

* **@lottiefiles/react-lottie-player**: `^3.6.0` - A React component for playing Lottie animations.
* **@react-oauth/google**: `^0.12.1` - A React library for Google OAuth authentication.
* **axios**: `^1.8.4` - A promise-based HTTP client for making requests.
* **jwt-decode**: `^4.0.0` - A library for decoding JSON Web Tokens.
* **moment**: `^2.30.1` - A library for working with dates and times.
* **react-dom**: `^18.2.0` - A library for rendering React components to the DOM.
* **react-hook-form**: `^7.56.1` - A library for managing forms in React.
* **react-icons**: `^5.5.0` - A library for using icons in React.
* **react-router-dom**: `^7.5.0` - A library for client-side routing in React.
* **react-spinners**: `^0.17.0` - A library for displaying loading spinners in React.
* **react-toastify**: `^11.0.5` - A library for displaying toast notifications in React.
* **react-tsparticles**: `^2.12.2` - A library for displaying particles in React.
* **tsparticles**: `^3.8.1` - A library for creating particles.
* **web-vitals**: `^4.2.4` - A library for measuring web performance metrics.

### Utilities

* **cors**: `^2.8.5` - A library for enabling CORS in Express.js.
* **framer-motion**: `^12.9.4` - A library for animating components in React.
* **lottie-react**: `^2.4.1` - A library for playing Lottie animations in React.
* **rect**: `^1.2.1` - A library for working with rectangles.
* **toast**: `^0.5.4` - A library for displaying toast notifications.

### Development Packages

* **@eslint/js**: `^9.21.0` - A library for linting JavaScript code.
* **@types/react-dom**: `^19.0.4` - Type definitions for React DOM.
* **@vitejs/plugin-react**: `^4.3.4` - A Vite plugin for React.
* **autoprefixer**: `^10.4.21` - A library for adding vendor prefixes to CSS.
* **eslint**: `^9.21.0` - A library for linting code.
* **eslint-plugin-react-hooks**: `^5.1.0` - A library for linting React hooks.
* **eslint-plugin-react-refresh**: `^0.4.19` - A library for linting React Refresh.
* **globals**: `^15.15.0` - A library for defining global variables.
* **postcss**: `^8.5.3` - A library for transforming CSS.
* **tailwindcss**: `^4.1.3` - A library for styling components with Tailwind CSS.

**Security & Version Assessment**
------------------------------

* **axios**: `^1.8.4` - This version is outdated and has known security vulnerabilities. Consider updating to the latest version.
* **moment**: `^2.30.1` - This library is deprecated and should be replaced with a more modern alternative.
* **react**: `^18.2.0` - This version is outdated and may have known security vulnerabilities. Consider updating to the latest version.
* **react-dom**: `^18.2.0` - This version is outdated and may have known security vulnerabilities. Consider updating to the latest version.

**Environment Setup Requirements**
--------------------------------

### Installation Commands

* `npm install` - Install all dependencies listed in `package.json`.
* `npm install --save-dev` - Install all development dependencies listed in `package.json`.

### Configuration Variables

* `VITE_PORT` - The port number to use for the Vite development server.
* `VITE_PUBLIC_DIR` - The directory to serve static files from.
* `VITE_OUT_DIR` - The directory to output compiled files to.

### Setup Instructions

1. Clone the repository and navigate to the project directory.
2. Run `npm install` to install all dependencies.
3. Run `npm install --save-dev` to install all development dependencies.
4. Create a new file called `.env` in the project root and add the following configuration variables:
```bash
VITE_PORT=3000
VITE_PUBLIC_DIR=public
VITE_OUT_DIR=dist
```
5. Run `npm run dev` to start the Vite development server.
6. Open a web browser and navigate to `http://localhost:3000` to view the application.