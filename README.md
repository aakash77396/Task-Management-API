# 📋 Task Management API

A secure and scalable **Task Management REST API** built using **Node.js, Express.js, and MongoDB**. The API provides user authentication, role-based access control, task management, JWT security, rate limiting, and email notifications.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login
- User Logout (JWT Blacklist)
- JWT Authentication
- Role-Based Access Control (Admin, Manager, User)

### ✅ Task Management
- Create Task
- View All Tasks
- View Assigned Tasks
- Get Task By ID
- Update Task
- Delete Task
- Task Assignment
- Task Filtering
- Task Sorting

### 🛡️ Security
- JWT Authentication
- Password Hashing using bcrypt
- Express Validator Input Validation
- Brute Force Protection (Login Rate Limiting)
- Endpoint Rate Limiting
- Token Blacklisting on Logout

### 📧 Notifications
- Welcome Email on Registration
- Login Alert Email

### 📄 Documentation
- Swagger API Documentation

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Express Validator | Input Validation |
| Express Rate Limit | Rate Limiting |
| Nodemailer | Email Notifications |
| Swagger UI | API Documentation |
| dotenv | Environment Variables |

---

# 📂 Project Structure

```
task-management-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   └── userController.js
│
├── middleware/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── rateLimiter.js
│
├── models/
│   ├── userModel.js
│   ├── taskModel.js
│   └── blacklistTokenModel.js
│
├── routes/
│   ├── authRoutes.js
│   ├── taskRoutes.js
│   └── userRoutes.js
│
├── utils/
│   └── sendEmail.js
│
|
├── swagger.yaml
├── server.js
├── package.json
└── README.md
```

---

## Assumptions / Design Decisions

- JWT is invalidated using a blacklist collection during logout.
- MongoDB Atlas is used as the primary database.
- Passwords are securely hashed using bcryptjs.
- Authentication is implemented using JWT Bearer Tokens.
- Role-based access is enforced through middleware.
- Swagger UI is available at `/api-docs`.

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/aakash77396/Task-Management-API.git
```

Go to project folder

```bash
cd task-management-api
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_app_password
```

Run the project

```bash
npm run dev
```

---

# 📖 API Documentation

After starting the server, open:

```
http://localhost:5001/api-docs
```

Swagger UI provides complete API documentation with request and response examples.

---

# 🔑 Authentication

All protected APIs require a JWT token.

Example:

```
Authorization: Bearer <your_jwt_token>
```

---

# 👥 User Roles

### Admin

- Manage all users
- Manage all tasks
- Assign tasks
- Delete tasks

### Manager

- Create tasks
- Update own tasks
- Assign tasks to Users

### User

- View assigned tasks
- Update assigned tasks (based on permissions)
- View own profile

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/logout |
| GET | /api/auth/admin |
| GET | /api/auth/manager |
| GET | /api/auth/user |

---

## Tasks

| Method | Endpoint |
|---------|----------|
| POST | /api/tasks |
| GET | /api/tasks |
| GET | /api/tasks/assigned |
| GET | /api/tasks/:id |
| PUT | /api/tasks/:id |
| DELETE | /api/tasks/:id |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | /api/users/profile |

---

# 🔍 Filtering

Example

```
GET /api/tasks?status=Pending
```

```
GET /api/tasks?priority=High
```

```
GET /api/tasks?status=Completed&priority=High
```

---

# 📊 Sorting

Sort by due date

```
GET /api/tasks?sortBy=dueDate
```

Descending

```
GET /api/tasks?sortBy=createdAt&order=desc
```

Ascending

```
GET /api/tasks?sortBy=createdAt&order=asc
```

---

# 🛡️ Rate Limiting

Implemented using **express-rate-limit**

### Login Endpoint

Protects against brute-force attacks by limiting repeated login attempts.

### Read APIs

Separate limiter for GET requests.

### Write APIs

Separate limiter for POST, PUT and DELETE requests.

---

# 📧 Email Notifications

The system sends emails for:

- User Registration
- Successful Login

Implemented using **Nodemailer**.

---

# 🔒 Logout

JWT tokens are invalidated using a **Blacklist Token Collection**.

After logout, the same token cannot be used again.

---

# 🧪 Testing

The API can be tested using:

- Swagger UI
- Postman

---

# 👨‍💻 Author

**Aakash Kumar**

B.Tech CSE (2022–2026)

Full Stack MERN Developer

---

# 📃 License

This project is created for educational and assignment purposes.