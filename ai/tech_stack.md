## Tech Stack

- **Frontend:** Angular (latest stable version)
- **UI Components:** Angular Material
- **Backend:** Firebase Firestore (NoSQL)
- **Authentication:** Firebase Authentication
- **Hosting:** Firebase Hosting

All dependencies should use the latest stable versions unless otherwise specified.

## Development Practices

- **Angular CLI:** Use the Angular CLI (`ng generate`) for creating new components, services, routes, and other Angular artifacts to ensure consistency and adherence to best practices.

## Firebase Configuration

To connect to your Firebase project, create a `firebase.config.json` file in the `src/app/` directory with your project's credentials. The application is configured to load this file automatically.

**Example `src/app/firebase.config.json`:**

```json
{
  "projectId": "YOUR_PROJECT_ID",
  "appId": "YOUR_APP_ID",
  "storageBucket": "YOUR_STORAGE_BUCKET",
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_AUTH_DOMAIN",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID"
}
```

**Note:** Replace the placeholder values with your actual Firebase project credentials.

## State Management

For managing asynchronous data streams, such as data from Firestore, use Angular Signals. This provides a modern and efficient way to handle state changes in your application.

**Example:**

```typescript
import { signal } from '@angular/core';

// In your component
const polls = signal<Poll[]>([]);

ngOnInit() {
  this.pollService.getPolls().subscribe(data => {
    this.polls.set(data);
  });
}
```

In the template, you can then access the value of the signal directly:

```html
<mat-table [dataSource]="polls()">
  <!-- ... -->
</mat-table>
```

## Firebase Emulators

To develop and test locally, you will need to install and run the Firebase emulators. You can install the emulators by running `firebase init emulators` and selecting the Authentication and Firestore emulators. To start the emulators, run `firebase emulators:start`.

Using Angular's `isDevMode()` function, the application is configured to automatically connect to the Firebase Authentication and Firestore emulators when running in development mode. The emulators are expected to be running on `localhost:9099` (Auth) and `localhost:8080` (Firestore).

## Route Parameter Handling

For handling route parameters, the application utilizes Angular's Router Component Input Binding. This feature automatically binds route parameters to component input properties, simplifying parameter access and decoupling components from the `ActivatedRoute` service.

To enable this, `withComponentInputBinding()` is used in the router configuration:

```typescript
import { provideRouter, withComponentInputBinding } from '@angular/router';

// In app.config.ts
provideRouter(routes, withComponentInputBinding()),
```

In components, route parameters are accessed directly via `input()` properties, where the input property name matches the route parameter name:

```typescript
import { input } from '@angular/core';

// In your component (e.g., PollVoteComponent)
export class PollVoteComponent {
  // 'id' matches the ':id' parameter in the route definition (e.g., 'poll/:id')
  id = input.required<string>();

  // Access the value like a signal
  ngOnInit() {
    const pollId = this.id();
    // ... use pollId
  }
}
```

This approach promotes cleaner, more testable components by treating route parameters as standard component inputs.

## Editing FormArrays

When working with a `FormGroup` that contains a `FormArray`, special care must be taken when populating the form with existing data, especially when the number of items in the array can change.

Using `form.patchValue()` or `form.setValue()` with an array of different length than the current `FormArray` will result in an error. The correct way to handle this is to clear the existing `FormArray` and then dynamically create and push new `FormControl` instances for each item in the data array.

**Example:**

```typescript
editItem(item: Item): void {
  // Patch the static values of the form
  this.form.patchValue({
    title: item.title,
    // other static properties...
  });

  // Re-create the FormArray for the dynamic list of options
  const optionsFormArray = this.formBuilder.array(
    item.options.map(option => this.formBuilder.control(option, Validators.required))
  );
  this.form.setControl('options', optionsFormArray);
}
```

This ensures the form structure always matches the data, preventing runtime errors and ensuring the UI displays the correct values.
