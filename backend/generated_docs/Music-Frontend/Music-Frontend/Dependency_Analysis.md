Dependency & Package Analysis Guide
=====================================

### Table of Contents

1. [Third-Party Libraries Breakdown](#third-party-libraries-breakdown)
2. [Security & Version Assessment](#security--version-assessment)
3. [Environment Setup Requirements](#environment-setup-requirements)

### Third-Party Libraries Breakdown
The project utilizes the following third-party libraries:

#### Core Frameworks
* **React**: A JavaScript library for building user interfaces (`^18.2.0`)
* **React DOM**: A package for working with the DOM in React (`^18.2.0`)

#### Libraries
* **@lottiefiles/react-lottie-player**: A React component for playing Lottie animations (`^3.6.0`)
* **@react-oauth/google**: A library for Google OAuth authentication in React (`^0.12.1`)
* **@tailwindcss/vite**: A plugin for using Tailwind CSS with Vite (`^4.1.3`)
* **axios**: A library for making HTTP requests (`^1.8.4`)
* **framer-motion**: A library for animations and gestures (`^12.9.4`)
* **jwt-decode**: A library for decoding JSON Web Tokens (`^4.0.0`)
* **lottie-react**: A React component for playing Lottie animations (`^2.4.1`)
* **moment**: A library for working with dates and times (`^2.30.1`)
* **react-hook-form**: A library for managing forms in React (`^7.56.1`)
* **react-hot-toast**: A library for displaying toast notifications (`^2.5.2`)
* **react-icons**: A library for using icons in React (`^5.5.0`)
* **react-router-dom**: A library for client-side routing in React (`^7.5.0`)
* **react-spinners**: A library for displaying loading spinners (`^0.17.0`)
* **react-toastify**: A library for displaying toast notifications (`^11.0.5`)
* **react-tsparticles**: A library for displaying particle animations (`^2.12.2`)

#### Utilities
* **cors**: A library for enabling CORS in Express.js (`^2.8.5`)

#### Development Packages
* **eslint**: A library for linting JavaScript code (installed separately)

### Security & Version Assessment
The following packages have potential security risks or are deprecated:

* **moment**: This package is deprecated and has known security vulnerabilities. Consider replacing it with a more modern alternative like **dayjs**.
* **cors**: This package has known security vulnerabilities. Make sure to keep it up to date and use it with caution.
* **jwt-decode**: This package has known security vulnerabilities. Make sure to keep it up to date and use it with caution.

The following packages have major version changes:

* **react**: The project is using React 18, which has significant changes from previous versions. Make sure to review the documentation and update the code accordingly.
* **react-router-dom**: The project is using React Router DOM 7, which has significant changes from previous versions. Make sure to review the documentation and update the code accordingly.

### Environment Setup Requirements
To set up the environment, follow these steps:

#### 1. Install Node.js and npm
Make sure you have Node.js and npm installed on your machine. You can download the latest version from the official Node.js website.

#### 2. Install dependencies
Run the following command in your terminal:
```bash
npm install
```
This will install all the dependencies listed in the `package.json` file.

#### 3. Configure environment variables
The project uses the following environment variables:

* **VITE_PORT**: The port number for the Vite development server. Default value is 3000.
* **VITE_HOST**: The hostname for the Vite development server. Default value is localhost.

You can configure these variables in a `.env` file or in your operating system's environment variables.

#### 4. Start the development server
Run the following command in your terminal:
```bash
npm run dev
```
This will start the Vite development server, and you can access the application at `http://localhost:3000`.

#### 5. Build the application
Run the following command in your terminal:
```bash
npm run build
```
This will build the application for production, and you can find the output in the `dist` folder.

#### 6. Preview the application
Run the following command in your terminal:
```bash
npm run preview
```
This will start a preview server, and you can access the application at `http://localhost:3000`.