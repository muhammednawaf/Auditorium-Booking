# 🎟️ Auditorium Booking System

This is a comprehensive Auditorium Booking application designed to simplify the process of reserving auditoriums for events, seminars, and meetings. Built using modern web technologies, it supports secure authentication, real-time booking management, role-based access, and payment integration.

---

## 📄 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Admin Panel](#admin-panel)
- [Super Admin Panel](#super-admin-panel)
- [User Management](#user-management)
- [Security](#security)
- [Contributing](#contributing)
- [Contact](#contact)

---

## ✅ Features

- 🎟️ **Book Auditorium**: Users can view available auditoriums, filter by features and pricing, and book slots.
- 💳 **Secure Payments**: Integrated with Razorpay for seamless online payments.
- 🔐 **Authentication & Authorization**: Secure login, session, and cookie management for all user roles.
- 🔁 **Forgot Password**: Email verification and password reset functionality using Nodemailer.
- 🧾 **Booking Status Tracking**: Users can track booking status (pending, approved, rejected).
- 🧑‍💼 **Role-Based Access**:
  - **Users**: Book auditoriums, manage profile, view and cancel bookings, reset password.
  - **Admins**: Manage assigned auditorium bookings, approve/reject bookings, view payment statuses.
  - **Super Admin**: Create, update, and delete auditoriums; set pricing and features; manage all bookings across auditoriums; approve/reject bookings; manage admin accounts (create, update, delete); view detailed payment and booking info.
- 📊 **Admin & Super Admin Dashboards**: Enhanced tables using DataTables for sorting, searching, and pagination.
- 🗂️ **Booking History**: Users can view past and upcoming bookings.

---

## 💻 Technologies Used

- **Node.js**: Server-side runtime environment.
- **Express.js**: Web framework for building backend APIs.
- **MongoDB**: NoSQL database to store user, booking, and auditorium data.
- **Handlebars / EJS**: Templating engines for dynamic rendering.
- **Bootstrap**: Frontend framework for responsive UI design.
- **jQuery & AJAX**: For dynamic front-end interactions and smooth UX.
- **Razorpay**: Payment gateway for online transactions.
- **Nodemailer**: Email service for password resets and booking notifications.
- **bcrypt**: Secure password hashing.
- **Session & Cookies**: Manage secure sessions for authentication.
- **DataTables**: Enhanced table functionalities for admin dashboards.

---

## ⚙️ Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/muhammednawaf/Auditorium-Booking.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd Auditorium-Booking
    ```

3. **Install dependencies**:

    ```bash
    npm install
    ```

4. **Create a `.env` file** and add the following:

    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/auditorium_booking
    SESSION_SECRET=your_session_secret
    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret
    EMAIL_USER=your_email_address
    EMAIL_PASS=your_email_password_or_app_password
    ```

5. **Start the application**:

    ```bash
    npm start
    ```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🚀 Usage

- **Homepage**: Browse available auditoriums and view details.
- **Book Auditorium**: Select date and time, complete booking, and pay online.
- **My Bookings**: View, track, or cancel your bookings.
- **Admin Panel**: Approve or reject booking requests for assigned auditoriums.
- **Super Admin Panel**: Manage all auditoriums, bookings, and admin accounts.

---

## ⚙️ Configuration

- **Session Management**: Configure `SESSION_SECRET` for secure sessions.
- **Database Connection**: Update `MONGODB_URI` as needed.
- **Razorpay**: Provide your `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- **Nodemailer**: Set up `EMAIL_USER` and `EMAIL_PASS` for sending verification and reset emails.

---

## 🛠️ Admin Panel

- Access via: `/admin`
- Admins can only view and manage bookings for auditoriums they oversee.
- Approve or reject booking requests.
- View payment statuses and booking details.

---

## 🏆 Super Admin Panel

- Access full system-wide dashboard.
- Create, update, and delete auditoriums (configure features and pricing).
- Approve or reject bookings across all auditoriums.
- View all booking details and payment statuses (verified, failed).
- Manage all admin accounts (add, update, delete credentials).

---

## 👥 User Management

- Users can:
  - Register, log in, and manage their profile.
  - Book auditoriums and view booking history.
  - Reset passwords via email verification (Nodemailer).
- Super admins can manage all admin accounts and monitor system activity.

---

## 🛡️ Security

- Passwords securely hashed using bcrypt.
- Session & cookie-based authentication for protected routes.
- Email verification for password reset via Nodemailer.
- Razorpay integration for verified payments and status tracking.

---

## 🌐 Live Demo

👉 **[Click here to view the live application](https://auditorium-booking-hosting.onrender.com/)**

---

## 🤝 Contributing

Contributions are welcome!  
Please fork the repository, create a new branch for your feature or fix, and submit a pull request.

---

## 📬 Contact

For questions or support, please contact **nawafsuneer@gmail.com**.

---
