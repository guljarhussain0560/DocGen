# Project Overview
## Tech Stack & Architecture Style
The project utilizes a modern tech stack, with the primary programming language being **JavaScript**. The main framework employed is **React**, a popular JavaScript library for building user interfaces. The project also leverages **Vite** as the development server and build tool.

The architecture style is based on a **Modular** approach, with separate directories for different features and components. The project uses a **Component-Driven** architecture, where each component is a self-contained unit of code that represents a UI element.

The project dependencies include:
* **Frontend Frameworks**: React, React DOM
* **State Management**: React Hook Form
* **Routing**: React Router DOM
* **UI Components**: React Icons, Lottie React, React Spinners
* **Utilities**: Axios, Moment, JWT Decode
* **Build Tool**: Vite
* **CSS Framework**: Tailwind CSS (via @tailwindcss/vite)

The project does not appear to have a dedicated database, suggesting that it may be using a **Backend-as-a-Service (BaaS)** or a separate backend API.

## Directory Breakdown
The project directory tree is organized into the following structure:
* **Root Directory**:
	+ `eslint.config.js`: ESLint configuration file
	+ `reportWebVitals.js`: Web Vitals reporting script
	+ `package.json`: Project metadata and dependencies
* **src Directory**:
	+ `App.jsx`: Main application component
	+ `auth`: Authentication-related components and services
		- `OAuth2RedirectHandler.jsx`: OAuth2 redirect handler component
		- `ResetPassword.jsx`: Reset password component
		- `SignInPage.jsx`: Sign-in page component
		- `SignUpPage.jsx`: Sign-up page component
		- `authService.js`: Authentication service
	+ `components`: Reusable UI components
		- `Errors.jsx`: Error component
		- `NotFound.jsx`: Not found component
		- `aboutPage`: About page components
		- `contactPage`: Contact page components
		- `footer`: Footer component
		- `pages`: Page components (e.g. Home, HomeAfterLogin)
* **Other Directories**: None

## Core Entrypoints
The application starts with the `App.jsx` component, which is the main entry point. The `App.jsx` component imports other components and services as needed.

The `index.js` file is not present in the repository, suggesting that the project uses a **Vite**-generated entry point.

The key entry files are:
* `App.jsx`: Main application component
* `authService.js`: Authentication service
* `reportWebVitals.js`: Web Vitals reporting script

## Setup & Dependencies Summary
To run the project, the following dependencies are required:
* **Node.js**: JavaScript runtime environment
* **Vite**: Development server and build tool
* **React**: Frontend framework
* **React DOM**: React DOM library
* **React Hook Form**: State management library
* **React Router DOM**: Routing library
* **Axios**: HTTP client library
* **Moment**: Date and time library
* **JWT Decode**: JSON Web Token decoding library

The project also requires the following environment variables:
* **None**: The project does not appear to require any specific environment variables.

To set up the project, run the following commands:
* `npm install`: Install dependencies
* `npm run dev`: Start the development server
* `npm run build`: Build the project for production
* `npm run lint`: Run ESLint on the project code
* `npm run preview`: Preview the built project