
# Secrets Web Application

## Login and register using email and google account

This is a Node.js web application that allows users to register, log in, and anonymously share secrets. The app uses Passport.js for authentication, including Google OAuth2, and MongoDB for data storage.

## Features

- User authentication with Passport.js (local and Google OAuth2 strategies).
- Secure session management.
- Mongoose for MongoDB interactions.
- EJS templating for dynamic content rendering.

## Technologies Used

- Node.js
- Express.js
- Passport.js
- MongoDB with Mongoose
- EJS for templating
- Body-parser for parsing incoming request bodies
- Dotenv for environment variable management

## Setup

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed and running locally or an accessible MongoDB Atlas cluster.

### Installation

1. **Clone the repository:**
   ```bash
    https://github.com/Moiz-CodeByte/Register-Login-system-using-google.git
   cd Register-Login-system-using-google
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```env
   CLIENT_ID=your-google-client-id
   CLIENT_SECRET=your-google-client-secret
   ```

4. **Run the application:**
   ```bash
   node app.js
   ```

5. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Home Page:** Access the home page at `/`.
- **Register:** Register a new account at `/register`.
- **Login:** Log in to your account at `/login`.
- **Secrets:** View shared secrets at `/secrets` (requires authentication).
- **Submit Secret:** Submit a new secret at `/submit` (requires authentication).
- **Logout:** Log out of your account at `/logout`.

## Project Structure

```
secrets-app/
│
├── public/
│   └── (static assets)
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── secrets.ejs
│   └── submit.ejs
├── .env
├── app.js
├── package.json
└── README.md
```

## Code Overview

### app.js

This is the main entry point of the application. It sets up the Express server, configures middleware, connects to MongoDB, and defines routes for authentication and rendering views.

### Middleware

- **express.static:** Serves static files from the `public` directory.
- **body-parser:** Parses incoming request bodies.
- **express-session:** Manages user sessions.
- **passport:** Initializes Passport.js for authentication.

### MongoDB Models

- **User Model:** Defines the user schema with plugins for Passport.js and find-or-create functionality.

### Routes

- **GET /:** Renders the home page.
- **GET /auth/google:** Initiates Google OAuth2 authentication.
- **GET /auth/google/secrets:** Handles the Google OAuth2 callback.
- **GET /login:** Renders the login page.
- **POST /login:** Handles login form submission.
- **GET /logout:** Logs out the user.
- **GET /register:** Renders the registration page.
- **POST /register:** Handles registration form submission.
- **GET /secrets:** Renders the secrets page (requires authentication).
- **GET /submit:** Renders the submit secret page (requires authentication).
- **POST /submit:** Handles secret submission.

## License

This project is licensed under the MIT License.
```

