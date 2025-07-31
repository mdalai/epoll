# Poll App Requirements

## Core Features

### 1. Poll Management (Admin)
- Create, edit, pause, or delete polls.
- Polls have: title/question, multiple-choice options (single/multiple select), optional duration, and custom settings (e.g., anonymous voting, results visibility).
- Dashboard to view all polls (active/inactive).

### 2. Poll Sharing & Access
- Share polls via unique links, email invites, or QR codes (optional).
- Users can access polls without registration (optional login for restricted polls).

### 3. Voting System
- Users must enter their name before voting.
- Users vote on active polls (once per poll, unless allowed).
- Vote change allowed if enabled by admin.
- Show confirmation after voting.

### 4. Real-Time Results
- Live results with charts (bar, pie, etc.) and total vote counts.
- Optional: demographic breakdowns if user data is collected.

## Roles & Permissions
- **Admin:** Full poll management, analytics, and moderation (delete flagged votes).
- **User:** Vote and view results (if allowed); no admin access.

