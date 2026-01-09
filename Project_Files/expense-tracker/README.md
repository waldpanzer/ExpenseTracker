# Expense Tracker Web Application (Portfolio Project DLBCSPJWD01)

This repository implements the **Expense Tracker Web App** used for the portfolio examination.
It follows the requirements of the *Project Java and Web Development (DLBCSPJWD01)* assignment.

## 1. Tech Stack

- Frontend: HTML5, CSS3 (Bootstrap), Vanilla JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose ODM)
- Auth: JSON Web Tokens (JWT)

## 2. Project Structure

- `backend/` – Node/Express REST API, MongoDB models and routes
- `frontend/` – Static web client that consumes the backend API

## 3. Backend – Getting Started

1. Install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file based on `.env.example` and adjust:

   ```env
   MONGO_URI=mongodb://localhost:27017/expense-tracker
   JWT_SECRET=yourStrongSecret
   PORT=5000
   ```

3. Run the server:

   ```bash
   npm start
   ```

   The API will be available at `http://localhost:5000`.

## 4. Frontend – Getting Started

1. Open `frontend/index.html` directly in your browser **or** serve it via a simple HTTP server
   (e.g. VS Code Live Server or `npx serve`).
2. Make sure the backend is running on `http://localhost:5000`.

## 5. Screencast (Required by Assignment)

The assignment requires a 1–2 minute screencast that:
- Shows the desktop view of the running web application
- Demonstrates the responsive view (e.g. developer tools mobile view)

> This screencast cannot be created automatically here. Please record it locally
using a tool such as OBS Studio or Screencast-O-Matic and then embed it in the PPTX
for Phase 2/3 as required by the assignment.

## 6. GitHub

To comply with the portfolio specification, push this folder to a **public GitHub repository**
and use that link in your PebblePad submission.
