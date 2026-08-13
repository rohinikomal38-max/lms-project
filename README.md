# 🎓 LMS - Learning Management System

A full-stack Learning Management System built with React, Node.js, Express, and MongoDB.

This platform provides a complete learning experience where students can browse courses, enroll through secure online payments, watch lectures, track their course progress, and rate courses. Educators can create and manage courses, view enrolled students, and monitor earnings through an educator dashboard.

---



## 🚀 Live Demo

### Frontend
https://lms-project-ruby-sigma.vercel.app/
### Backend API
https://lms-backend-beige-six.vercel.app/


## ✨ Features

### 👨‍🎓 Student Features

- 🔐 Secure authentication with Clerk
- 📚 Browse available courses
- 🔎 Search and explore courses
- 📖 View detailed course information
- 💳 Secure course payments with Stripe
- 🎓 Automatic course enrollment after successful payment
- ▶️ Watch course lectures
- 📊 Track lecture completion and course progress
- ✅ Mark lectures as completed
- ⭐ Rate courses
- 📋 View enrolled courses
- 📱 Responsive student interface

### 👨‍🏫 Educator Features

- 🔑 Educator authentication and role management
- ➕ Create and publish courses
- 🖼️ Upload course thumbnails
- 📚 Add chapters and lectures
- 🎥 Add lecture videos
- 📊 Educator dashboard
- 💰 Track total earnings
- 👥 View enrolled students
- 📈 View latest enrollments
- 📚 Manage educator courses

### 💳 Payment System

- Stripe Checkout integration
- Secure payment processing
- Payment status tracking
- Successful payment verification using Stripe Webhooks
- Automatic enrollment after successful payment
- Failed payment handling
- Purchase records stored in MongoDB

### 📈 Course Progress

- Lecture completion tracking
- Course progress stored in MongoDB
- Completed lecture count
- Course completion status
- Progress available across sessions

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Tailwind CSS
- Axios
- React Toastify
- React YouTube
- Humanize Duration
- Clerk Authentication

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Clerk
- Stripe
- Cloudinary
- Multer
- CORS

### Deployment

- Vercel
- MongoDB Atlas
- Cloudinary
- Stripe

---

## 🏗️ Project Structure

```text
LMS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── student/
│   │   │   └── educator/
│   │   ├── context/
│   │   ├── assets/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── configs/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── public/
│   └── server.js
│
├── .gitignore
└── README.md
---

## 📸 Screenshots

### Home Page

<img width="1850" height="982" alt="image" src="https://github.com/user-attachments/assets/1829ea42-6d62-4445-a10b-611edb534b58" />


### Course Page

<img width="1725" height="1032" alt="image" src="https://github.com/user-attachments/assets/03b96962-bbe5-45de-8e45-c0f0b68fc4d2" />


### Educator Dashboard

<img width="1882" height="892" alt="image" src="https://github.com/user-attachments/assets/f45d083b-3b34-493b-b464-2fe060a10c55" />


---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/rohinikomal38-max/YOUR_REPO_NAME.git


📦 Frontend Setup
cd frontend
npm install
npm run client

📦 Backend Setup
cd backend
npm install
npm run server

---


🎯 Future Improvements

Some features that can be added in the future:

🔔 Notifications
💬 Student and educator messaging
📝 Quizzes and assignments
📜 Course completion certificates
🔍 Advanced course filtering
📊 More detailed analytics
❤️ Wishlist functionality
🌙 Dark mode

👨‍💻 Author
Rohini Komal


⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.
