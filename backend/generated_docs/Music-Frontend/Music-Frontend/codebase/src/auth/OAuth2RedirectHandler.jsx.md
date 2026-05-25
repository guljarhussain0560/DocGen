OAuth2 Redirect Handler Documentation
=====================================

### 1. Overview

The `OAuth2RedirectHandler` component is responsible for handling the redirect from an OAuth2 authentication flow. It extracts the authentication token from the URL query parameters, stores it in local storage, and uses it to fetch the logged-in user's details from the backend API. If the token is valid, it redirects the user to the home page; otherwise, it redirects to the login page with an error message.

### 2. Functions/Classes

#### `OAuth2RedirectHandler` Component

*   **Signature:** `const OAuth2RedirectHandler = () => { ... }`
*   **Parameters:** None
*   **Return Value:** A JSX element displaying a loading message or a redirecting message
*   **Usage Example:**

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

*   **Signature:** `useEffect(() => { ... }, [navigate])`
*   **Parameters:**
    *   `navigate`: A function from `react-router-dom` to navigate to different routes
*   **Return Value:** None
*   **Usage Example:**

    ```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform some side effect when the component mounts
    navigate('/home');
  }, [navigate]);

  return <div>My Component</div>;
};
```

### 3. Dependencies

The `OAuth2RedirectHandler` component depends on the following external imports:

*   `react`: The React library for building user interfaces
*   `react-router-dom`: The React Router library for client-side routing
*   `api`: A custom API service for making requests to the backend API
*   `import.meta.env.VITE_BACKEND_DOMAIN`: An environment variable containing the backend domain URL
*   `localStorage`: The Web Storage API for storing data locally in the browser

These dependencies are used to:

*   Handle client-side routing and navigation
*   Make requests to the backend API to fetch user details
*   Store authentication tokens and user details in local storage

### 4. Usage Examples

Here's an example of how to use the `OAuth2RedirectHandler` component in a React application:

```javascript
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import OAuth2RedirectHandler from './OAuth2RedirectHandler';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};
```

### 5. Edge Cases & Warnings

*   **Missing Token:** If the `token` query parameter is missing from the URL, the component will redirect to the login page with an error message.
*   **Invalid Token:** If the `token` is invalid or expired, the backend API will return an error response, and the component will redirect to the login page with an error message.
*   **CSRF Token Mismatch:** If the CSRF token stored in local storage does not match the one expected by the backend API, the request will fail, and the component will redirect to the login page with an error message.
*   **Backend API Errors:** If the backend API returns an error response, the component will catch the error and redirect to the login page with an error message.

To avoid these edge cases, ensure that:

*   The `token` query parameter is properly set in the URL
*   The `token` is valid and not expired
*   The CSRF token is properly stored in local storage and matches the one expected by the backend API
*   The backend API is properly configured and returns valid responses