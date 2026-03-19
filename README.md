# TempoTalk

TempoTalk is a full-stack web application that allows users to create accounts, share posts, and interact through a simple social-style platform focused around music and discussion.

---

## Features

* User authentication (create account, login, logout)
* Create, view, and delete posts
* Update account settings (username, email, password)
* Server-side validation for:

  * Account creation
  * Login
  * Post creation
* Username uniqueness enforcement
* MySQL database integration
* Dynamic rendering using EJS templates

---

## Tech Stack

* **Backend:** Node.js, Express
* **Frontend:** HTML, CSS, EJS
* **Database:** MySQL (using `mysql2`)
* **Other:** dotenv for environment variables

---

## Project Structure

```
project-root/
│
├── public/               # Static files (CSS, JS, images)
├── views/                # EJS templates
│   ├── partials/         # Reusable components (navbars, etc.)
│
├── validation.js         # Server-side validation logic
├── app.js                # Main server file
├── .env                  # Environment variables
└── package.json
```

---

## Setup & Installation

### 1. Clone the repository

```
git clone https://github.com/your-username/tempotalk.git
cd tempotalk
```

### 2. Install dependencies

```
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=your_database
DB_PORT=your_port
```

---

### 4. Set up the database

Example schema:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    email VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT,
    links TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

### 5. Run the server

```
node app.js
```

Visit:

```
http://localhost:3004
```

---

## Key Functionality

### Authentication

* Users can create accounts and log in
* Basic session handled with a global `currentUser` variable

### Validation

* Server-side validation ensures:

  * Required fields are filled
  * Passwords match
  * Emails are valid
  * Usernames are unique

### Posts

* Logged-in users can:

  * Create posts
  * View posts
  * Delete their own posts

### Settings

* Users can update:

  * Username (with uniqueness check)
  * Email
  * Password

---

## Known Limitations

* Uses a global `currentUser` (not scalable)
* Passwords are stored in plain text (not secure)
* No session management (`express-session` not implemented yet)

---

## Potential Improvements

* Implement password hashing with `bcrypt`
* Add proper session handling (`express-session`)
* Live username availability checking (AJAX)
* Improve UI/UX (error styling, responsiveness)
* Mobile-friendly design
* Add search and filtering for posts
* Add the ability to post with pictures
* Embed a music player for posts linking to sites such as Spotify, Soundcloud, Apple Music, etc.
* Add the ability for users with accounts to like, dislike, and comment on posts

---

## Contact

If you have any questions or feedback, feel free to reach out!
* Hosea: h.nacanaynay@gmail.com 

