# Digital Wellness Dashboard - System Architecture

## Overview
This application is a full-stack, production-ready system consisting of a pure modern HTML/CSS/JS frontend (no framework required to maximize rendering speed) connected to an Express.js backend and a PostgreSQL database.

## System Components

1.  **Frontend (Vanilla JS + Theme.css)**: 
    - Handles UI rendering, user interaction, profile management (stored locally via `UserData`), and analytics visualization.
    - Captures smartphone usage metrics and posts them to the securely configured Node.js backend API.
    - Utilizes a `theme.css` standard for a pure SaaS layout (no neon glows).
2.  **Backend (Node.js + Express.js)**:
    - Provides a robust REST API layer.
    - Includes core middleware (Helmet, Morgan, CORS, ErrorHandling) for security and observability.
3.  **Database (PostgreSQL)**:
    - Stores structured schemas for:
        - `users`: Core profile data (`email`, `phone`).
        - `predictions`: Historical prediction data, calculated risk score, levels, etc.
        - `notifications`: Audit logs tracking notification dispatch status.
4.  **External Services**:
    - **Nodemailer/SendGrid**: Dispatches HTML-formatted email reports.
    - **Twilio**: Dispatches SMS notification alerts automatically on request.

---

## Expected Output Flow

The application executes a highly linear, fault-tolerant sequence when users submit prediction data.

### 1. User Input & Validation (Frontend)
1. The user fills out their smartphone metrics (Screen time, Unlocks, Social media hours, Gaming, Night usage) on `dashboard.html`.
2. `prediction.js` intercepts the form submission and performs client-side validation to ensure no missing fields.
3. The frontend retrieves the user's `email` and `phone` from local profile state (`UserData.get()`). If no phone exists, a fallback (+10000000000) is injected to explicitly bypass API schema crashes while quietly ignoring SMS dispatching later.
4. The UI swaps into a loading state.

### 2. Request Dispatch
5. The frontend strictly executes an `await fetch('/api/predictions', { method: 'POST', body: ... })` call to the server in **online mode only**. The offline fallback has been removed for production integrity.

### 3. Backend Processing (Controller)
6. `PredictionController.js` catches the request.
7. Validates data against `Joi` schemas (ensuring phone regex, email formats, and number bounds).
8. A Database Transaction (`BEGIN`) is started.
    - Queries the `users` table to create or update the user based on incoming `email`.
    - `predictionService.js` calculates the statistical risk score off the inputs.
    - The metric inputs and resultant risk level (e.g., "High Risk", "75/100") are securely inserted (`INSERT`) into the `predictions` table tracking to the respective `user_id`.

### 4. Asynchronous Notifications
9. While inside the transaction block, `notificationService.js` attempts to fire parallel dispatches:
   - Evaluates `emailService.sendEmail` to the user's registered Email.
   - Evaluates `smsService.sendSMS` to the user's registered Phone (via Twilio).
   - *Note: In a true production environment with massive load, this would ideally move to a Redis/BullMQ queue.*
10. The notification tracking bounds are written into the `notifications` table (storing whether the dispatch `sent = true/false`).

### 5. Finalization
11. The Database Transaction is committed (`COMMIT`).
12. A `201 Created` generic JSON response containing the metrics, risk, and generated *Notification Delivery Toggles* returns to the frontend frontend.

### 6. User Display
13. `prediction.js` resolves the API response.
14. It gracefully throws a success toast ("✅ Prediction generated! Email sent!").
15. Stores the resultant values into `sessionStorage` and triggers a redirect to `result.html` to populate the frontend graphs and data visually using Chart.js.
