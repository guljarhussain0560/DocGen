**OAuth2RedirectHandler**
==========================

### Overview

The `OAuth2RedirectHandler` component handles the redirect from an OAuth2 authorization server after a user has authenticated. It extracts the authorization token from the URL query parameters, stores it in local storage, and fetches the user's details from the backend API. If the token is invalid or missing, it redirects the user to the login page with an error message.

### Functions/Classes

#### `OAuth2RedirectHandler`

* **Signature:** `OAuth2RedirectHandler() => JSX.Element`
* **Parameters:** None
* **Return Value:** A JSX element displaying a loading message or a redirecting message
* **Usage Example:**

```javascript
import OAuth2RedirectHandler from './OAuth2RedirectHandler';

const App = () => {
  return (
    <div>
      <OAuth2RedirectHandler />
    </div>
  );
};
```

#### `useEffect` Hook

* **Signature:** `useEffect(effect: () => void, dependencies: DependencyList) => void`
* **Parameters:**
	+ `effect`: A function that contains the side-effect logic
	+ `dependencies`: An array of dependencies that determines when the effect is re-run
* **Return Value:** None
* **Usage Example:**

```javascript
import { useEffect } from 'react';

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  // ...
}, [navigate]);
```

### Dependencies

* **`react`**: The React library is used for building the component and handling side effects.
* **`react-router-dom`**: The `useNavigate` hook from `react-router-dom` is used for client-side routing.
* **`../components/services/api`**: The `api` object is imported from a separate module and provides a way to make HTTP requests to the backend API.
* **`import.meta.env.VITE_BACKEND_DOMAIN`**: The `VITE_BACKEND_DOMAIN` environment variable is used to construct the backend API URL.
* **`localStorage`**: The `localStorage` API is used to store the authorization token and user details.

### Usage Examples

To use the `OAuth2RedirectHandler` component, simply import it and render it in your app:

```javascript
import OAuth2RedirectHandler from './OAuth2RedirectHandler';

const App = () => {
  return (
    <div>
      <OAuth2RedirectHandler />
    </div>
  );
};
```

Make sure to configure the `VITE_BACKEND_DOMAIN` environment variable to point to your backend API.

### Edge Cases & Warnings

* **Missing Token**: If the authorization token is missing from the URL query parameters, the component will redirect the user to the login page with an error message.
* **Invalid Token**: If the authorization token is invalid, the component will redirect the user to the login page with an error message.
* **CSRF Token**: The component assumes that a CSRF token is stored in local storage under the key `CSRF_TOKEN`. If this token is missing, the API request will fail.
* **Backend API**: The component assumes that the backend API is configured to return the user's details in the response body. If the API returns an error or an unexpected response, the component will fail.