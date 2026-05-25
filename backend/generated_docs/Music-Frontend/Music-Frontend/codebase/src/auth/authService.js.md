**Authentication Service Documentation**
=====================================

### Overview

The `authService.js` module provides a set of functions for handling user authentication in the application. It allows users to sign in, sign up, log out, and authenticate with Google. This module plays a crucial role in the system by managing user sessions and interacting with the backend API.

### Functions/Classes

#### 1. `signIn(username, password)`

*   **Signature:** `async (username: string, password: string) => Promise<{ jwtToken: string, username: string }>`
*   **Parameters:**
    *   `username`: The user's username
    *   `password`: The user's password
*   **Return Value:** A promise that resolves with an object containing the JWT token and the username
*   **Usage Example:**

```javascript
import { signIn } from './authService';

const username = 'johnDoe';
const password = 'password123';

signIn(username, password)
  .then((response) => {
    console.log('Signed in successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-in failed:', error);
  });
```

#### 2. `signUp(userData)`

*   **Signature:** `async (userData: object) => Promise<{ message: string }>`
*   **Parameters:**
    *   `userData`: An object containing the user's registration data
*   **Return Value:** A promise that resolves with an object containing a success message
*   **Usage Example:**

```javascript
import { signUp } from './authService';

const userData = {
  username: 'janeDoe',
  email: 'jane@example.com',
  password: 'password123',
};

signUp(userData)
  .then((response) => {
    console.log('Signed up successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-up failed:', error);
  });
```

#### 3. `handleLogout()`

*   **Signature:** `async () => Promise<void>`
*   **Parameters:** None
*   **Return Value:** A promise that resolves when the logout process is complete
*   **Usage Example:**

```javascript
import { handleLogout } from './authService';

handleLogout()
  .then(() => {
    console.log('Logged out successfully');
  })
  .catch((error) => {
    console.error('Logout failed:', error);
  });
```

#### 4. `signInWithGoogle()`

*   **Signature:** `async () => Promise<{ jwtToken: string, username: string }>`
*   **Parameters:** None
*   **Return Value:** A promise that resolves with an object containing the JWT token and the username
*   **Usage Example:**

```javascript
import { signInWithGoogle } from './authService';

signInWithGoogle()
  .then((response) => {
    console.log('Signed in with Google successfully:', response);
  })
  .catch((error) => {
    console.error('Google sign-in failed:', error);
  });
```

### Dependencies

The `authService.js` module depends on the following external imports:

*   `axios`: A popular JavaScript library for making HTTP requests.
*   `api`: An instance of the `axios` library with interceptors, imported from `../components/services/api`.

These dependencies are used to interact with the backend API and manage user sessions.

### Usage Examples

Here are some real-world code examples showing how to use the `authService.js` module:

```javascript
import React, { useState } from 'react';
import { signIn, signUp, handleLogout } from './authService';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const handleSignIn = async () => {
    try {
      const response = await signIn(username, password);
      console.log('Signed in successfully:', response);
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await signUp(userData);
      console.log('Signed up successfully:', response);
    } catch (error) {
      console.error('Sign-up failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await handleLogout();
      console.log('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <form>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="button" onClick={handleSignIn}>
          Sign In
        </button>
      </form>
      <form>
        <label>Username:</label>
        <input type="text" value={userData.username} onChange={(e) => setUserData({ ...userData, username: e.target.value })} />
        <br />
        <label>Email:</label>
        <input type="email" value={userData.email} onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
        <br />
        <label>Password:</label>
        <input type="password" value={userData.password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
        <br />
        <button type="button" onClick={handleSignUp}>
          Sign Up
        </button>
      </form>
      <button type="button" onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default App;
```

### Edge Cases & Warnings

Here are some gotchas, known limitations, or things developers should watch out for when using the `authService.js` module:

*   **Error Handling:** The `authService.js` module catches and logs errors, but it's essential to handle errors properly in your application to provide a better user experience.
*   **Security:** The `authService.js` module stores the JWT token in local storage, which can be a security risk if not handled properly. Make sure to use HTTPS and follow best practices for securing user data.
*   **Backend API:** The `authService.js` module assumes that the backend API is properly configured and secured. Ensure that your backend API is secure and follows best practices for authentication and authorization.
*   **Google Sign-in:** The `authService.js` module uses the Google Sign-in API, which requires a Google Developer Console project and credentials. Make sure to set up your Google Developer Console project and credentials correctly to use the Google Sign-in feature.