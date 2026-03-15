# Digital Blood Bank

A full-stack web application that connects blood donors with patients and hospitals during emergencies. The system allows donors to register, users to search for donors by blood group and city, and hospitals or patients to create blood requests.

This project is built using **React for the frontend**, **Node.js + Express for the backend**, and **MongoDB Atlas for the database**.

---

# Tech Stack

Frontend

* React

Backend

* Node.js
* Express.js

Database

* MongoDB Atlas

Other Tools

* Postman (API testing)
* Git & GitHub (version control)
* Morgan (API logging)
* Nodemon (development server)

---

# Features

### Donor Management

* Register new donors
* Store donor information in database
* Search donors by blood group
* View all registered donors

### Blood Request Management

* Create blood request for patients
* Store hospital and contact information
* View all blood requests
* Update request status (pending → fulfilled)

### Authentication

* Basic login using phone number
* Role based users (donor / recipient / admin)

### Backend Improvements

* Centralized error handling middleware
* API request logging using Morgan
* Modular project structure (controllers, routes, models)

---

# Project Structure

```
digital-blood-bank
│
├── client
│   └── (React frontend – to be developed)
│
├── server
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── userController.js
│   │   ├── requestController.js
│   │   └── authController.js
│   │
│   ├── middleware
│   │   └── errorMiddleware.js
│   │
│   ├── models
│   │   ├── User.js
│   │   └── Request.js
│   │
│   ├── routes
│   │   ├── userRoutes.js
│   │   ├── requestRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

# API Endpoints

### User APIs

Register User

POST /api/users/register

Example Request:

```
{
  "name": "Tejas",
  "bloodGroup": "O+",
  "phone": "9876543210",
  "city": "Pune",
  "role": "donor"
}
```

---

Get All Donors

GET /api/users/donors

---

Find Donors by Blood Group

GET /api/users/blood/:group

Example:

```
GET /api/users/blood/O+
```

---

### Blood Request APIs

Create Blood Request

POST /api/requests

Example Request:

```
{
  "patientName": "Rahul",
  "bloodGroup": "O+",
  "hospital": "Pune City Hospital",
  "city": "Pune",
  "contact": "9876543210"
}
```

---

Get All Blood Requests

GET /api/requests

---

Update Request Status

PUT /api/requests/:id

Used to mark request as **fulfilled**.

---

### Authentication API

Login User

POST /api/auth/login

Example Request:

```
{
  "phone": "9876543210"
}
```

---

# Installation and Setup

Clone the repository

```
git clone https://github.com/TEJAS-PARKAR/digital-blood-bank.git
```

Move into project folder

```
cd digital-blood-bank
```

Move to backend folder

```
cd server
```

Install dependencies

```
npm install
```

Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start development server

```
npm run dev
```

Server will run on

```
http://localhost:5000
```

---

# Testing APIs

Use **Postman** to test APIs.

Test endpoints such as:

* Register donor
* Get donor list
* Create blood request
* Update request status
* Login user

---

# Future Improvements

* React frontend interface
* Admin dashboard
* Donor availability status
* Email / SMS notifications
* JWT authentication
* Deployment on AWS


Author

Tejas Parkar

GitHub:
https://github.com/TEJAS-PARKAR