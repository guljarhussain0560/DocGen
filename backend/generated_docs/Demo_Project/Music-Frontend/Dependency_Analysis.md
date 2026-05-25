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
* **Vite**: `^6.2.0` - A development server and build tool.

### Libraries

* **@lottiefiles/react-lottie-player**: `^3.6.0` - A React component for playing Lottie animations.
* **@react-oauth/google**: `^0.12.1` - A React library for Google OAuth authentication.
* **axios**: `^1.8.4` - A promise-based HTTP client.
* **jwt-decode**: `^4.0.0` - A library for decoding JSON Web Tokens.
* **moment**: `^2.30.1` - A library for working with dates and times.
* **react-dom**: `^18.2.0` - A library for rendering React components to the DOM.
* **react-router-dom**: `^7.5.0` - A library for client-side routing in React applications.
* **react-toastify**: `^11.0.5` - A library for displaying toast notifications in React applications.

### Utilities

* **cors**: `^2.8.5` - A library for enabling CORS in Express.js applications.
* **framer-motion**: `^12.9.4` - A library for animating React components.
* **react-hook-form**: `^7.56.1` - A library for managing forms in React applications.
* **react-hot-toast**: `^2.5.2` - A library for displaying toast notifications in React applications.
* **react-icons**: `^5.5.0` - A library for using icons in React applications.
* **react-spinners**: `^0.17.0` - A library for displaying loading spinners in React applications.
* **react-tsparticles**: `^2.12.2` - A library for creating particle animations in React applications.
* **tsparticles**: `^3.8.1` - A library for creating particle animations.
* **web-vitals**: `^4.2.4` - A library for measuring web performance metrics.

### Development Packages

* **@eslint/js**: `^9.21.0` - A library for linting JavaScript code.
* **@types/react-dom**: `^19.0.4` - Type definitions for React DOM.
* **@vitejs/plugin-react**: `^4.3.4` - A Vite plugin for building React applications.
* **autoprefixer**: `^10.4.21` - A library for automatically prefixing CSS rules.
* **eslint**: `^9.21.0` - A library for linting JavaScript code.
* **eslint-plugin-react-hooks**: `^5.1.0` - A library for linting React hooks.
* **eslint-plugin-react-refresh**: `^0.4.19` - A library for linting React Refresh.
* **globals**: `^15.15.0` - A library for defining global variables.
* **postcss**: `^8.5.3` - A library for transforming CSS code.
* **tailwindcss**: `^4.1.3` - A library for building custom user interfaces.

**Security & Version Assessment**
------------------------------

* **cors**: `^2.8.5` - This package has a known vulnerability (CVE-2020-28168) and should be updated to the latest version.
* **moment**: `^2.30.1` - This package is deprecated and should be replaced with a alternative library such as `date-fns`.
* **react**: `^18.2.0` - This package is using a major version that is not the latest. Consider updating to the latest major version.

**Environment Setup Requirements**
---------------------------------

### Installation Commands

* `npm install` - Install all dependencies listed in `package.json`.
* `npm install --save-dev` - Install all development dependencies listed in `package.json`.

### Configuration Variables

* `VITE_PORT` - The port number to use for the Vite development server.
* `VITE_PUBLIC_DIR` - The directory to serve static files from.
* `VITE_OUT_DIR` - The directory to output the built application to.

### Setup Instructions

1. Clone the repository and navigate to the project directory.
2. Run `npm install` to install all dependencies.
3. Run `npm run dev` to start the Vite development server.
4. Open a web browser and navigate to `http://localhost:3000` to view the application.

Note: Make sure to update the `cors` package to the latest version and consider replacing `moment` with a alternative library. Additionally, consider updating the `react` package to the latest major version.