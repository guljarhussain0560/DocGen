System Architecture Guide
========================
## Component Architecture
The system consists of the following key software layers:

*   **Presentation/API Layer**: This layer is responsible for handling user interactions and providing a interface for the system. It includes the web application (built with Next.js) and the API (built with Fastify).
*   **Core Business Logic**: This layer contains the core business logic of the system, including services and utilities. It is implemented in the `@hookrelay/services` and `@hookrelay/lib` packages.
*   **Data Access Layer**: This layer is responsible for interacting with the database and managing data. It is implemented in the `@hookrelay/db` package.
*   **Background Jobs**: This layer is responsible for handling background tasks and events. It is implemented in the worker application (built with BullMQ).
*   **External Integrations**: This layer is responsible for integrating with external systems and services. It includes libraries such as `axios` and `jose`.

## Database & Data Flow Model
Based on the provided information, the following database tables and key entities can be inferred:

*   **Users**: A table to store user information, including authentication details.
*   **Events**: A table to store event data, including event types and payloads.
*   **Tasks**: A table to store task data, including task status and results.

The data flow model can be described as follows:

*   User interactions are handled by the web application and API, which interact with the core business logic layer to perform actions.
*   The core business logic layer interacts with the data access layer to retrieve and store data in the database.
*   The background jobs layer interacts with the data access layer to retrieve and store task data in the database.
*   External integrations are used to interact with external systems and services, which may involve storing and retrieving data in the database.

## Component Interaction Diagram
```mermaid
graph TD
    A[Web Application] -->|API Calls|> B[API]
    B -->|Business Logic|> C[Core Business Logic]
    C -->|Database Interactions|> D[Data Access Layer]
    D -->|Database|> E[Database]
    E -->|Data|> D
    D -->|Data|> C
    C -->|Task Handling|> F[Background Jobs]
    F -->|Task Interactions|> D
    D -->|Task Data|> F
    F -->|Event Handling|> G[Event Handling]
    G -->|Event Data|> D
    D -->|Event Data|> G
    H[External Integrations] -->|API Calls|> B
    H -->|Data Interactions|> D
```

## Key Integration Flows
The following key operations flow through the system:

*   **Authentication**: The web application handles user authentication, which involves interacting with the core business logic layer to verify user credentials. The core business logic layer interacts with the data access layer to retrieve and store user data in the database.
*   **External API Calls**: The API handles external API calls, which involve interacting with external systems and services. The API interacts with the core business logic layer to perform actions, which may involve storing and retrieving data in the database.
*   **Webhook Handling**: The API handles webhook events, which involve interacting with the core business logic layer to perform actions. The core business logic layer interacts with the data access layer to retrieve and store event data in the database.
*   **Task Handling**: The background jobs layer handles task interactions, which involve interacting with the data access layer to retrieve and store task data in the database. The background jobs layer interacts with the core business logic layer to perform actions, which may involve storing and retrieving data in the database.
*   **Event Handling**: The event handling layer handles event interactions, which involve interacting with the data access layer to retrieve and store event data in the database. The event handling layer interacts with the core business logic layer to perform actions, which may involve storing and retrieving data in the database.