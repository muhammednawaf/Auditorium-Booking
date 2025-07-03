
````markdown
# 🎟️ Auditorium Booking System

A robust, full-stack web application for managing auditorium bookings with secure payments, advanced role-based access, and integrated email notifications.

---

## 🚀 Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS / Handlebars, Bootstrap
- **Database:** MongoDB
- **Payments:** Razorpay
- **Authentication & Security:** bcrypt, sessions, cookies, email verification
- **Email Service:** Nodemailer

---

## ✨ Features

### 👤 **User**

- View and filter available auditoriums for booking.
- Submit booking requests and pay securely via Razorpay.
- View booking status (approved, pending, rejected).
- Access "My Account" section with profile info, booking history, and logout.
- Reset password using a secure email verification flow (via Nodemailer).
- Receive email notifications for booking updates and password resets.
- Session and cookie management for secure access.

---

### 🛡️ **Admin**

- Manage assigned auditoriums and related booking requests.
- Approve or reject bookings for their assigned auditoriums.
- View booking details and payment statuses (verified, failed).
- Cannot manage other admins or modify auditorium settings.

---

### 🏆 **Super Admin**

- Create, update, and delete auditoriums (configure features and pricing).
- Manage all booking requests across all auditoriums.
- Approve or reject any booking, and view global booking/payment details.
- Create, update, and remove admins with login credentials.
- Manage all admins and monitor system-wide activity.

---

## 💻 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammednawaf/Auditorium-Booking.git
   cd Auditorium-Booking
````

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/auditorium_booking
   SESSION_SECRET=your_session_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password_or_app_password
   ```

4. **Start the application**

   ```bash
   npm start
   ```

Access the app at [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Usage

* **Users:**

  * Explore and book auditoriums.
  * Make payments via Razorpay.
  * Receive email confirmations and status updates.
  * Manage profile and reset passwords with secure email verification.

* **Admins:**

  * Approve or reject booking requests for assigned auditoriums.
  * Monitor payment statuses and view detailed booking information.

* **Super Admin:**

  * Manage all auditoriums and bookings.
  * Add, update, and remove admins.
  * Access global booking and payment information.

---

## 🛡️ Security

* Passwords hashed using bcrypt for secure storage.
* Session and cookie-based authentication.
* Secure email-based password reset via Nodemailer.
* Payment status verified using Razorpay APIs and callbacks.

---

## 💌 Email Integration

* Integrated **Nodemailer** for sending emails to users:

  * Password reset links.
  * Booking status updates and confirmations.

---

## 🤝 Contributing

Contributions are welcome!
Please fork the repository, create a new feature branch, and submit a pull request.

---

## 📬 Contact

For any questions or support, please reach out to **[nawafsuneer@gmail.com](mailto:nawafsuneer@gmail.com)**.

---

