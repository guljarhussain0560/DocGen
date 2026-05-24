System Architecture Guide
==========================

### Component Architecture

The system is built using a modular, component-based architecture with separate directories for components, authentication, and pages. The key software layers are:

*   **Presentation Layer**: This layer is responsible for rendering the user interface and handling user interactions. It consists of React components, including `App.jsx`, `Home.jsx`, `HomeAfterLogin.jsx`, and various UI components in the `components/` directory.
*   **API Layer**: This layer handles API requests and responses. It is implemented using Axios and is used for authentication, data fetching, and other external API calls.
*   **Core Business Logic**: This layer contains the core logic of the application, including authentication, routing, and data processing. It is implemented in the `auth/` directory and various utility modules.
*   **Data Access Layer**: Since there is no explicit database configuration, this layer is not applicable. However, if a database were to be integrated, this layer would handle data storage and retrieval.
*   **Background Jobs**: There are no background jobs in this system.
*   **External Integrations**: The system integrates with Google OAuth for authentication and uses various libraries for UI components, routing, and utilities.

### Database & Data Flow Model

Since there is no explicit database configuration, we can infer that the system relies on external APIs or services for data storage and retrieval. However, if a database were to be integrated, the key entities and data flows might look like this:

*   **Users**: A table to store user information, including authentication details.
*   **Pages**: A table to store page metadata, including titles, descriptions, and content.
*   **Components**: A table to store component metadata, including types, properties, and relationships.

Data flows might include:

*   User authentication: The system authenticates users using Google OAuth and stores authentication details in the `Users` table.
*   Page rendering: The system retrieves page metadata from the `Pages` table and renders the corresponding page using React components.
*   Component rendering: The system retrieves component metadata from the `Components` table and renders the corresponding component using React components.

### Component Interaction Diagram

```mermaid
graph TD
    User -->| Authenticates with | Google OAuth
    Google OAuth -->| Redirects to | OAuth2RedirectHandler
    OAuth2RedirectHandler -->| Handles redirect | AuthService
    AuthService -->| Authenticates user | Users
    Users -->| Returns user data | AuthService
    AuthService -->| Returns authentication result | App
    App -->| Renders page | Home
    Home -->| Retrieves page metadata | Pages
    Pages -->| Returns page metadata | Home
    Home -->| Renders components | Components
    Components -->| Retrieves component metadata | Components
    Components -->| Returns component metadata | Home
    Home -->| Renders component | Component
    Component -->| Handles user interaction | App
    App -->| Handles route changes | React Router
    React Router -->| Updates URL | Browser
    Browser -->| Requests new page | App
    App -->| Renders new page | Home
```

### Key Integration Flows

*   **Authentication**: The system authenticates users using Google OAuth. When a user attempts to log in, the system redirects them to the Google OAuth page. After authentication, Google OAuth redirects the user back to the system, which handles the redirect using the `OAuth2RedirectHandler` component. The `AuthService` module then authenticates the user and returns the authentication result to the `App` component.
*   **External API Calls**: The system uses Axios to make external API calls. For example, when the system needs to retrieve page metadata, it makes an API call to the `Pages` API endpoint.
*   **Webhook Handling**: There are no webhooks in this system.
*   **Data Storage**: Since there is no explicit database configuration, the system relies on external APIs or services for data storage and retrieval. If a database were to be integrated, the system would use the `Data Access Layer` to store and retrieve data.