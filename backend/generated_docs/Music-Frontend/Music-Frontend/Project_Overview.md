**Project Overview**
======================

### Tech Stack & Architecture Style

* **Primary Programming Languages:** JavaScript (ES6+ syntax)
* **Main Frameworks:** React (for building user interfaces), Vite (for development and build processes)
* **Database:** None (no explicit database configuration found in the repository)
* **Libraries:**
	+ Authentication: `@react-oauth/google` for Google OAuth, `jwt-decode` for token decoding
	+ UI Components: `@lottiefiles/react-lottie-player`, `framer-motion`, `react-icons`, `react-spinners`, `react-toastify`
	+ Routing: `react-router-dom`
	+ Utilities: `axios`, `cors`, `moment`, `react-hook-form`
* **Design Patterns:** Modular, component-based architecture with separate directories for components, authentication, and pages

### Directory Breakdown

* **Root Directory:**
	+ `eslint.config.js`: ESLint configuration file
	+ `reportWebVitals.js`: Web Vitals reporting script
	+ `src/`: Source code directory
* **Source Code Directory (`src/`):**
	+ `App.jsx`: Main application component
	+ `auth/`: Authentication directory
		- `OAuth2RedirectHandler.jsx`: OAuth redirect handler component
		- `ResetPassword.jsx`: Reset password component
		- `SignInPage.jsx`: Sign-in page component
		- `SignUpPage.jsx`: Sign-up page component
		- `authService.js`: Authentication service module
	+ `components/`: UI components directory
		- `Errors.jsx`: Error component
		- `NotFound.jsx`: Not found component
		- `aboutPage/`: About page directory
			- `AboutPage.jsx`: About page component
		- `contactPage/`: Contact page directory
			- `ContactPage.jsx`: Contact page component
		- `footer/`: Footer directory
			- `Footer.jsx`: Footer component
		- `pages/`: Pages directory
			- `Home.jsx`: Home page component
			- `HomeAfterLogin.jsx`: Home page component after login
* **Configuration Files:**
	+ `package.json`: Project configuration file

### Core Entrypoints

* **Main Entry Point:** `src/App.jsx`
* **Import Chain:**
	+ `src/App.jsx` imports components from `src/components/` and `src/auth/`
	+ Components in `src/components/` import utilities from `src/utils/` (not shown in the repository)
	+ `src/auth/authService.js` imports authentication libraries (`@react-oauth/google`, `jwt-decode`)

### Setup & Dependencies Summary

* **Environment Variables:** None explicitly mentioned in the repository
* **Dependencies:**
	+ **Development Dependencies:**
		- `@vitejs/plugin-react`: Vite plugin for React
		- `eslint`: ESLint for code linting
		- `tailwindcss`: Tailwind CSS for styling
	+ **Runtime Dependencies:**
		- `react`: React library
		- `react-dom`: React DOM library
		- `react-router-dom`: React Router library
		- `axios`: Axios library for HTTP requests
		- `cors`: CORS library for cross-origin resource sharing
		- `moment`: Moment library for date and time utilities
		- `react-hook-form`: React Hook Form library for form handling
		- `react-toastify`: React Toastify library for toast notifications
		- `tsparticles`: TSParticles library for particle animations
		- `web-vitals`: Web Vitals library for performance monitoring