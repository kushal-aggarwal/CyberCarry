# 🛍️ CyberCarry

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)

CyberCarry is a modern full-stack e-commerce web application built using **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Tailwind CSS**.

It provides a complete shopping experience including user authentication, cart management, checkout, payment selection, order history, profile management, and automated email notifications.

## 🚀 Live Demo

🔗 **Live Website:** [CyberCarry](https://cybercarry-v1.onrender.com)

> **Note:** This project is hosted on Render's free tier. The first request after a period of inactivity may take a few seconds while the server wakes up.


---

## Features

- 🔐 JWT Authentication
- 👤 User Profile Management
🛍️ Product Catalog with Filtering & Sorting
- 🛒 Shopping Cart
- ➕ Product Quantity Management
- 💳 UPI & Cash on Delivery (Demo)
- 📦 Order Placement
- 📜 Order History & Details
- 📧 Customer & Admin Transactional Email Notifications
- 🖼️ Product Image Uploads
- 🎨 Responsive UI
- 🏗️ MVC Architecture

---

## 🛠️ Tech Stack

### Frontend
- EJS
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt
- cookie-parser

### File Handling
- Multer

### Email Services
- Brevo Transactional Email API

### Session & Flash Messages
- express-session
- connect-flash

---

## 📁 Project Structure

```text
CyberCarry
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── public/
│   └── images/
├── routes/
├── utils/
├── views/
│   └── partials/
│
├── app.js
├── package.json
└── README.md
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/kushal-aggarwal/CyberCarry.git
```

Move into the project

```bash
cd CyberCarry
```

Install dependencies

```bash
npm install
```

Create a `.env` file in the project root

```env
MONGODB_URI=your_mongodb_connection_string
JWT_KEY=your_jwt_secret

EXPRESS_SESSION_SECRET=your_session_secret

BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL=verified_sender_email

MAIL_ID=your_email@gmail.com
MAIL_PASS=your_app_password
SUPPORT_EMAIL=your_email@gmail.com
```

Start the server

```bash
npm start
```

---

## 📷 Screenshots

### Shop

![Shop](screenshots/shop.png)

### Cart

![Cart](screenshots/cart.png)

### Checkout

![Checkout](screenshots/checkout.png)

### Payment

![Payment](screenshots/payment.png)

### Orders

![Orders](screenshots/orders.png)

### Profile

![Profile](screenshots/profile.png)

### Admin Page (Create Products)

![Admin](screenshots/admin.png)

---

## 💡 Future Improvements

- Wishlist
- Product Filtering & Sorting
- Product Reviews & Ratings
- Payment Gateway Integration (Stripe/Razorpay)
- Admin Dashboard
- Order Tracking

---

## 👨‍💻 Author

**Kushal Aggarwal**

Built by CyberForge using Node.js, Express, MongoDB and Tailwind CSS with Cyber...ness?

## Feedback & Contributions

If you find a bug, have a suggestion, or want to improve the project, feel free to open an issue or submit a pull request.

Carry yourself in style with CyberCarry. <br>
-Kushal Aggarwal

---

## 📄 License

This project is intended for educational and portfolio purposes.