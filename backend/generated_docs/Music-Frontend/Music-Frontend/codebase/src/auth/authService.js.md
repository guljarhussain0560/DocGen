**Authentication Service Module**
=====================================

### Overview

The `authService.js` module provides a set of functions for handling user authentication in the application. It encapsulates the logic for signing in, signing up, logging out, and Google sign-in, making it easy to manage user authentication throughout the app.

### Functions/Classes

#### `signIn(username, password)`

* **Signature:** `async (username: string, password: string) => Promise<{ jwtToken: string, username: string }>`
* **Parameters:**
	+ `username`: The username to sign in with.
	+ `password`: The password to sign in with.
* **Return Value:** A promise that resolves with an object containing the JWT token and the username.
* **Usage Example:**
```javascript
import { signIn } from './authService';

const username = 'johnDoe';
const password = 'mySecretPassword';

signIn(username, password)
  .then((response) => {
    console.log('Signed in successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-in failed:', error);
  });
```

#### `signUp(userData)`

* **Signature:** `async (userData: { username: string, password: string, ... }) => Promise<{ message: string }>`
* **Parameters:**
	+ `userData`: An object containing the user's data, including the username and password.
* **Return Value:** A promise that resolves with an object containing a success message.
* **Usage Example:**
```javascript
import { signUp } from './authService';

const userData = {
  username: 'janeDoe',
  password: 'mySecretPassword',
  email: 'jane@example.com',
};

signUp(userData)
  .then((response) => {
    console.log('Signed up successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-up failed:', error);
  });
```

#### `handleLogout()`

* **Signature:** `async () => Promise<void>`
* **Parameters:** None
* **Return Value:** A promise that resolves when the logout process is complete.
* **Usage Example:**
```javascript
import { handleLogout } from './authService';

handleLogout()
  .then(() => {
    console.log('Logged out successfully');
  })
  .catch((error) => {
    console.error('Error during logout:', error);
  });
```

#### `signInWithGoogle()`

* **Signature:** `async () => Promise<{ jwtToken: string, username: string }>`
* **Parameters:** None
* **Return Value:** A promise that resolves with an object containing the JWT token and the username.
* **Usage Example:**
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

* `axios`: Used for making HTTP requests to the backend API.
* `api`: An instance of the `axios` client with interceptors, imported from `../components/services/api`.

### Usage Examples

To use this module, simply import the desired function and call it with the required parameters. For example:
```javascript
import { signIn, signUp, handleLogout, signInWithGoogle } from './authService';

// Sign in with username and password
signIn('johnDoe', 'mySecretPassword')
  .then((response) => {
    console.log('Signed in successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-in failed:', error);
  });

// Sign up with user data
signUp({
  username: 'janeDoe',
  password: 'mySecretPassword',
  email: 'jane@example.com',
})
  .then((response) => {
    console.log('Signed up successfully:', response);
  })
  .catch((error) => {
    console.error('Sign-up failed:', error);
  });

// Log out
handleLogout()
  .then(() => {
    console.log('Logged out successfully');
  })
  .catch((error) => {
    console.error('Error during logout:', error);
  });

// Sign in with Google
signInWithGoogle()
  .then((response) => {
    console.log('Signed in with Google successfully:', response);
  })
  .catch((error) => {
    console.error('Google sign-in failed:', error);
  });
```

### Edge Cases & Warnings

* Make sure to handle errors properly when calling these functions, as they may throw errors if the backend API returns an error response.
* Be aware that the `handleLogout` function removes the JWT token from local storage, so you may need to handle this case in your application logic.
* When using the `signInWithGoogle` function, make sure to handle the case where the user cancels the Google sign-in flow.