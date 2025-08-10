# Poll App Development Plan

## 1. Planning

### Phase 1: Project Setup & Firebase Integration

- [x] Setup Angular project.
- [x] Install Angular Material.
- [x] Configure zoneless change detection.
- [x] Setup Firebase project (Firestore, Authentication, Hosting).
- [x] Integrate Firebase with the Angular application.

### Phase 2: Authentication

- [ ] Implement user authentication using Firebase Authentication.
- [ ] Create a login page.
- [ ] Create a registration page.
- [ ] Implement guest access (anonymous voting).

### Phase 3: Poll Management (Admin)

- [x] Create an admin dashboard to view all polls.
- [x] Implement functionality to create new polls (title, options, settings).
- [x] Implement functionality to edit existing polls.
- [x] Implement functionality to pause/resume polls.
- [x] Implement functionality to delete polls.
- [x] Implement a data model for polls in Firestore.

### Phase 4: Voting System (User)

- [x] Create a view for users to see and vote on a poll.
- [x] Implement the voting logic, storing votes in Firestore.
- [x] Require users to enter their name before voting.
- [x] Implement logic to prevent multiple votes from the same user (if required).
- [x] Allow users to change their vote (if enabled).
- [x] Show a confirmation message after a vote is cast.

### Phase 5: Real-Time Results

- [x] Create a component to display poll results in real-time.
- [x] Use charts (bar or pie) to visualize results.
- [x] Display total vote counts.
- [x] Display voter names in the admin component's poll results view.

### Phase 6: Poll Sharing & Access

- [x] Generate unique links for each poll.
- [ ] (Optional) Implement QR code generation for poll links.
- [ ] (Optional) Implement email invitations for polls.

### Phase 7: Deployment

- [ ] Deploy the application to Firebase Hosting.
- [ ] Final testing and QA.

## 2. Review

- [ ] Present this plan to the project lead for feedback and approval.

## 3. Execution

- Implemented the admin dashboard with functionality to create, edit, and view polls.
- Implemented the voting system, allowing users to vote on polls.
- Implemented a real-time results view in the admin dashboard with a sleek and modern design.
- Fixed a bug where the "allow multiple votes" option was not working correctly.
- Implemented display of voter names in the admin component's poll results view.

## 4. Documentation & Review

*(To be filled out after development is complete)*
