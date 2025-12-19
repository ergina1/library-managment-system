# Library Management System – Setup

## 1. Required Software (Install Manually)

Install the following tools before running the project:

- Node.js (v20+)
- Git
- Docker Desktop (optional)
- MongoDB

---

## 2. Backend Packages (server)

### Dependencies
- express
- mongoose
- dotenv
- bcryptjs
- jsonwebtoken
- cookie-parser
- cors
- nodemailer
- express-fileupload
- cloudinary
- node-cron
- groq-sdk

### Dev Dependencies
- nodemon

> All backend packages are installed automatically with `npm install`.

---

## 3. Frontend Packages (client)

### Main Dependencies
- react
- react-dom
- react-router-dom
- axios
- @reduxjs/toolkit
- react-redux
- react-icons
- react-toastify
- chart.js
- react-chartjs-2

### Styling / Build Tools
- tailwindcss
- postcss
- autoprefixer
- vite

> All frontend packages are installed automatically with `npm install`.

---

## 4. Run Backend

```bash
cd server
npm install
npm run dev
```

Backend runs on:
```
http://localhost:4000
```

---

## 5. Run Frontend (in a new terminal)

```bash
cd client
npm install
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```

---

## 6. Run With Docker (All-in-one)
When docker is running, the groq chat (chat assistant for all users) may not run properly due to heavy memory.

```bash
docker compose up --build
```

Frontend will be available at:
```
http://localhost
```
