**Project Overview**
=====================

**Tech Stack & Architecture Style**
------------------------------------

* **Primary Programming Languages:** JavaScript (ES6+ syntax)
* **Main Frameworks:** React, Vite
* **Database:** None (frontend-only project)
* **Libraries:**
	+ Authentication: `@react-oauth/google`, `jwt-decode`
	+ UI Components: `@lottiefiles/react-lottie-player`, `framer-motion`, `react-icons`, `react-spinners`, `react-toastify`
	+ Routing: `react-router-dom`
	+ Utilities: `axios`, `cors`, `moment`, `react-hook-form`
* **Design Patterns:** Modular, component-based architecture with a focus on separation of concerns

**Directory Breakdown**
----------------------

* **Root Directory:**
	+ `eslint.config.js`: ESLint configuration file
	+ `reportWebVitals.js`: Web Vitals reporting script
	+ `package.json`: Project metadata and dependencies
* **`src` Directory:**
	+ `App.jsx`: Main application component
	+ `auth`: Authentication module
		- `OAuth2RedirectHandler.jsx`: OAuth2 redirect handler component
		- `ResetPassword.jsx`: Reset password component
		- `SignInPage.jsx`: Sign-in page component
		- `SignUpPage.jsx`: Sign-up page component
		- `authService.js`: Authentication service module
	+ `components`: Reusable UI components
		- `Errors.jsx`: Error component
		- `NotFound.jsx`: Not found component
		- `aboutPage`: About page component
		- `contactPage`: Contact page component
		- `footer`: Footer component
		- `pages`: Page components
			- `Home.jsx`: Home page component
			- `HomeAfterLogin.jsx`: Home page component after login
* **Other Directories:**
	+ `node_modules`: Installed dependencies

**Core Entrypoints**
--------------------

* **Main Entry Point:** `src/App.jsx`
* **Import Chain:**
	+ `src/App.jsx` imports `src/components/pages/Home.jsx` or `src/components/pages/HomeAfterLogin.jsx` depending on the authentication state
	+ `src/components/pages/Home.jsx` and `src/components/pages/HomeAfterLogin.jsx` import other page components and UI components as needed

**Setup & Dependencies Summary**
---------------------------------

* **Environment Variables:** None required
* **Dependencies:**
	+ `@lottiefiles/react-lottie-player`: Lottie player component
	+ `@react-oauth/google`: Google OAuth2 authentication library
	+ `@tailwindcss/vite`: Tailwind CSS integration with Vite
	+ `axios`: HTTP client library
	+ `cors`: CORS middleware library
	+ `framer-motion`: Animation library
	+ `jwt-decode`: JWT decoding library
	+ `moment`: Date and time library
	+ `react`: React library
	+ `react-dom`: React DOM library
	+ `react-hook-form`: React hook form library
	+ `react-hot-toast`: Toast notification library
	+ `react-icons`: Icon component library
	+ `react-router-dom`: React router library
	+ `react-spinners`: Spinner component library
	+ `react-toastify`: Toast notification library
	+ `react-tsparticles`: Particle animation library
	+ `rect`: Rectangle utility library
	+ `toast`: Toast notification library
	+ `tsparticles`: Particle animation library
	+ `web-vitals`: Web Vitals reporting library
* **Dev Dependencies:**
	+ `@eslint/js`: ESLint JavaScript plugin
	+ `@types/react-dom`: React DOM type definitions
	+ `@vitejs/plugin-react`: Vite React plugin
	+ `autoprefixer`: Autoprefixer CSS postprocessor
	+ `eslint`: ESLint linter
	+ `eslint-plugin-react-hooks`: ESLint React hooks plugin
	+ `eslint-plugin-react-refresh`: ESLint React refresh plugin
	+ `globals`: Global variables plugin
	+ `postcss`: PostCSS CSS postprocessor
	+ `tailwindcss`: Tailwind CSS framework
	+ `vite`: Vite development server