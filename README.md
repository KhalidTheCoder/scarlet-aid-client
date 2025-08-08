# 🩸 ScarletAid - Blood Donation App

---

## 🔍 Project Overview

ScarletAid is a full-stack blood donation platform built to connect people in urgent need of blood with verified donors. The app features secure role-based dashboards for donors, volunteers, and admins, enabling efficient management of blood donation requests and fundraising through Stripe payments. Built using the MERN stack and Firebase, ScarletAid offers a responsive and user-friendly experience across all devices.

---

## 🌐 Live Project Link

[https://assignment-12-9d5a6.web.app/](https://assignment-12-9d5a6.web.app/)

---

## 🛠️ Technologies Used

- Frontend: React, Tailwind CSS, React Router, Lottie Animations  
- Backend: Node.js, Express.js, MongoDB  
- Authentication: Firebase Authentication & Admin SDK  
- Payments: Stripe  
- Data Handling: TanStack Query (React Query), Axios  
- Hosting: Firebase (client) & Vercel (server)

---

## 🖼️ Screenshot

![ScarletAid Screenshot](https://github.com/KhalidTheCoder/scarlet-aid-client/raw/main/IMG_0900.JPG)


---

## ✨ Core Features

- 🔐 Secure login & registration via Firebase Authentication (Email/Password)  
- 👥 Role-based dashboards for Donors, Volunteers, and Admins  
- 🩸 Donors can create, edit, delete, cancel, or complete blood donation requests  
- 📋 "My Donation Requests" page with filtering, pagination, and history tracking  
- 🧑‍⚖️ Admin panel to manage users (block/unblock, promote to volunteer/admin)  
- 📊 Full admin access to all blood donation requests for oversight and control  
- 🧑‍🤝‍🧑 Volunteers assist with request management without full admin privileges  
- 🔍 Smart filtering and search functionality for users and donation requests  
- 💳 Stripe integration for secure donation and fundraising transactions  
- 📱 Fully responsive design optimized for mobile, tablet, and desktop

---

## 📦 Dependencies

- react  
- react-router 
- tailwindcss  
- firebase  
- axios  
- @tanstack/react-query  
- stripe  
- express  
- mongoose  
- lottie-react  
- dotenv   
- cors  


---

## 🚀 How to Run Locally

1. Clone both repositories:

   ```bash
    git clone https://github.com/KhalidTheCoder/scarlet-aid-client.git
    git clone https://github.com/KhalidTheCoder/scarlet-aid-server.git


   
   
2. Set up and run the server:
   ```bash
   cd scarlet-aid-server
   npm install
   nodemon index.js

3. Set up and run the client:
   
   Open a new terminal and navigate to the client directory:
     
    ```bash
    cd scarlet-aid-client
    npm install
     
4. Create a .env file in the client folder and add your environment variables (example):
   
     ```ini
    VITE_API_URL=http://localhost:5000

    VITE_apiKey=your_firebase_api_key
    VITE_authDomain=your_firebase_auth_domain
    VITE_projectId=your_firebase_project_id
    VITE_storageBucket=your_firebase_storage_bucket
    VITE_messagingSenderId=your_firebase_messaging_sender_id
    VITE_appId=your_firebase_app_id

5. Start the client:
   ```bash
   npm run dev
   
6. Open your browser and go to:
   ```arduino
   http://localhost:3000


## 👤 Admin Access (Demo Credentials)

- **Username:** `admin@scarletaid.com`  
- **Password:** `Admin@1234`





      

   
    
    


