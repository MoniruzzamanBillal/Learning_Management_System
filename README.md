# MATS Academy - Learning Management System

**MATS Academy** is a modern, full-stack web-based Learning Management System (LMS) built for streamlined and interactive online education. Developed as part of the Software Engineering course (C470), it enables seamless communication and content delivery among students, instructors, and administrators.

---

## 🎯 Project Objectives

- Streamline course creation, enrollment, and management processes.
- Facilitate assignment submissions and progress tracking for students.
- Empower instructors to deliver content and assess students effectively.
- Provide administrators with full system oversight and controls.
- Deliver a scalable and user-friendly educational platform.

---

## 🚀 Core Features

### 👨‍🎓 Student Panel

- Register/login with secure **JWT-based authentication**.
- Browse and enroll in available courses.
- Monitor learning progress and view performance metrics.
- Submit reviews and ratings for completed courses.

### 👩‍🏫 Instructor Panel

- Create and manage structured course content modules.
- Upload learning materials.
- View enrolled students and track their progress.

### 🛠️ Admin Panel

- Approve or reject courses and content submissions.
- View platform-wide analytics and feedback.

---

## 🔐 Authentication & Authorization

- Role-based access control (Student, Instructor, Admin).
- Secure login/logout functionality using **JWT (JSON Web Tokens)**.

---

## 💳 Payment Integration

- Integrated with **SSLCOMMERZ** for course payments and financial transactions.

---

## 🧰 Tech Stack

- **Frontend**: React.js, TypeScript, Tailwind CSS, Shadcn UI, Redux Toolkit
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Payment Gateway**: SSLCOMMERZ

---

## 📸 Screenshots

<p align="center">
  <img src="https://res.cloudinary.com/dtq3fmrkh/image/upload/v1747979105/hu0lae5onpq-1747979102761-projectImg-img1.jpg" alt="Home page" >
</p>

<p align="center">
  <img src="https://i.postimg.cc/1t8pLZ3F/img2.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/TwBrxHK4/img3.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/J0JjzcJ4/img4.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/NFhrS9Vh/img5.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/dVWZvSXj/img6.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/Hn4jNSX5/img7.jpg" alt="">
</p>

<p align="center">
  <img src="https://i.postimg.cc/h49JhG6j/img8.jpg" alt="">
</p>

---

## 🔐 Credentials (for testing)

| Role       | Email                 | Password |
| ---------- | --------------------- | -------- |
| Admin      | abc@d.com             | 123456   |
| Instructor | instructor1@gmail.com | 123456   |
| Student    | user1@gmail.com       | 123456   |

---

## 🛠️ Installation

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/mats-academy.git
cd mats-academy
```

2. **Frontend Setup:**

```bash
cd \lms_client
npm install
npm run dev
```

3. **Backend Setup:**

```bash
cd \lms_server
npm install
npm run dev
```

4. **Environment Variables:**

Create `.env` files in both frontend and backend folders with appropriate variables like:

- JWT_SECRET
- MONGO_URI
- STORE_ID
- STORE_PASSWORD
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

---

## 🔗 Live Link

[https://devmats.vercel.app/](https://devmats.vercel.app/)

---

## 🙌 Acknowledgements

- Developed as part of the **C470 Software Engineering Course**.
- Inspired by modern LMS platforms like Coursera, Udemy, and Khan Academy.

---
