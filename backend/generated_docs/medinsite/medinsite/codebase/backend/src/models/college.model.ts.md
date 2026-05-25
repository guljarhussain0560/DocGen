# College Model Documentation
## Overview
The `college.model.ts` file defines a Mongoose model for interacting with a MongoDB collection named "College". This model represents a college entity with attributes such as name, state, city, and year of establishment. It plays a crucial role in the system by providing a structured interface for creating, reading, updating, and deleting college documents in the database.

## Functions/Classes
### ICollege Interface
```typescript
export interface ICollege extends Document {
  name: string;
  state: string;
  city: string;
  yearOfEstablishment: number;
}
```
*   **Purpose:** Defines the shape of a college document in the MongoDB collection.
*   **Properties:**
    *   `name`: The name of the college (string, required).
    *   `state`: The state where the college is located (string, required).
    *   `city`: The city where the college is located (string, required).
    *   `yearOfEstablishment`: The year the college was established (number, required).
*   **Usage Example:**
    ```typescript
const collegeDoc: ICollege = {
  name: 'Example College',
  state: 'New York',
  city: 'New York City',
  yearOfEstablishment: 1950,
};
```

### College Schema
```typescript
const collegeSchema = new Schema<ICollege>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  yearOfEstablishment: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true // This will add `createdAt` and `updatedAt` fields
});
```
*   **Purpose:** Defines the schema for the college model, including validation rules and additional fields.
*   **Properties:**
    *   `name`: The name of the college (string, required, trimmed).
    *   `state`: The state where the college is located (string, required).
    *   `city`: The city where the college is located (string, required).
    *   `yearOfEstablishment`: The year the college was established (number, required).
    *   `createdAt` and `updatedAt`: Automatically added timestamp fields.
*   **Usage Example:**
    ```typescript
// The schema is used internally by the College model
```

### College Model
```typescript
export const College = model<ICollege>('College', collegeSchema);
```
*   **Purpose:** Creates a Mongoose model for interacting with the "College" collection in the database.
*   **Parameters:**
    *   `ICollege`: The interface defining the shape of the college document.
    *   `collegeSchema`: The schema defining the structure and validation rules for the college model.
*   **Return Value:** A Mongoose model instance for the "College" collection.
*   **Usage Example:**
    ```typescript
import { College } from './college.model';

// Create a new college document
const newCollege = new College({
  name: 'Example College',
  state: 'New York',
  city: 'New York City',
  yearOfEstablishment: 1950,
});

// Save the college document to the database
newCollege.save((err, college) => {
  if (err) {
    console.error(err);
  } else {
    console.log(college);
  }
});
```

## Dependencies
The `college.model.ts` file depends on the following external modules:

*   `mongoose`: A popular MongoDB object modeling tool designed to work in an asynchronous environment.
    *   **Purpose:** Provides the `Schema` and `model` functions for defining and creating Mongoose models.
    *   **Usage:** Imported at the top of the file: `import { Schema, model, Document } from 'mongoose';`

## Usage Examples
Here are some examples of using the `College` model:

### Creating a New College Document
```typescript
import { College } from './college.model';

const newCollege = new College({
  name: 'Example College',
  state: 'New York',
  city: 'New York City',
  yearOfEstablishment: 1950,
});

newCollege.save((err, college) => {
  if (err) {
    console.error(err);
  } else {
    console.log(college);
  }
});
```

### Finding All College Documents
```typescript
import { College } from './college.model';

College.find().then((colleges) => {
  console.log(colleges);
}).catch((err) => {
  console.error(err);
});
```

### Updating a College Document
```typescript
import { College } from './college.model';

College.findByIdAndUpdate('collegeId', {
  name: 'Updated College Name',
}, { new: true }, (err, college) => {
  if (err) {
    console.error(err);
  } else {
    console.log(college);
  }
});
```

## Edge Cases & Warnings
*   **Validation Errors:** When creating or updating a college document, Mongoose will throw a validation error if the data does not conform to the defined schema. Make sure to handle these errors properly in your application.
*   **Duplicate College Names:** The current schema does not enforce unique college names. If you want to prevent duplicate names, consider adding a unique index on the `name` field.
*   **Missing Required Fields:** When creating a new college document, make sure to provide all required fields (`name`, `state`, `city`, and `yearOfEstablishment`). Failing to do so will result in a validation error.