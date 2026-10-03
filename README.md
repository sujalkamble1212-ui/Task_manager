# Full-Stack MERN Task Manager Application

A modern, production-grade **Full-Stack MERN (MongoDB, Express.js, React.js, Node.js)** Task Manager web application featuring full CRUD capabilities, real-time status management, and cloud deployment configuration for **Vercel** (frontend) and **Render** (backend) with **MongoDB Atlas**.

---

##  Key Features

- **Full CRUD Support**: Create, Read, Update, and Delete tasks seamlessly.
- **State & Status Toggles**: Quickly mark tasks as Pending or Completed with real-time UI synchronization.
- **Reference UI / Design**: Clean, minimalist light aesthetic matching the project specifications with soft gray inputs, dark action buttons, and circular status toggles.
- **Real-Time Counters**: Side-by-side live summary cards for **Pending** and **Completed** tasks.
- **Flexible MongoDB Integration**: Supports cloud **MongoDB Atlas** or local MongoDB via `MONGO_URI`, with an automatic zero-config in-memory fallback for instant local evaluation.
- **RESTful API Architecture**: Modular Express router and controllers following standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`).
- **Cloud Deployment Ready**: Preconfigured `render.yaml` for Render backend and `vercel.json` for Vercel frontend.

---

## 🏗️ Technology Stack & Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 React.js Frontend (Vite)                    │
│      - Clean minimalist UI with status toggles              │
│      - Centralized Axios client (src/api/tasks.js)          │
│      - Port: 3000                                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Node.js / Express.js Backend                │
│      - RESTful API router & controllers                     │
│      - CORS middleware & error handling                     │
│      - Port: 5000                                           │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                        │
│      - MongoDB Atlas (Cloud) / Local / In-memory fallback   │
│      - Task Schema with timestamps                          │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19, Vite, Vanilla CSS, Axios
- **Backend**: Node.js (v24), Express.js 4, Mongoose 8, CORS, Dotenv
- **Database**: MongoDB / MongoDB Atlas

---

## 📂 Project Structure

```
fullstack/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection logic
│   ├── controllers/
│   │   └── taskController.js     # CRUD handler functions
│   ├── models/
│   │   └── Task.js               # Mongoose Task schema
│   ├── routes/
│   │   └── taskRoutes.js         # Express REST API routes
│   ├── .env                      # Local environment configuration
│   ├── .env.example              # Sample environment template
│   ├── package.json              # Backend dependencies & scripts
│   ├── render.yaml               # Render web service deployment blueprint
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── tasks.js          # Centralized Axios API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Header with task count & API status
│   │   │   ├── TaskForm.jsx      # Add / Edit task card
│   │   │   ├── TaskList.jsx      # Your Tasks list wrapper
│   │   │   ├── TaskItem.jsx      # Task row item with circular check toggle
│   │   │   ├── StatsOverview.jsx # Pending & Completed counter boxes
│   │   │   ├── Toast.jsx         # User feedback notification
│   │   │   └── index.js          # Component barrel export
│   │   ├── App.jsx               # Main state management & orchestrator
│   │   ├── index.css             # Minimalist light theme design system
│   │   └── main.jsx              # React DOM mounting
│   ├── .env                      # Frontend environment variable
│   ├── .env.example              # Frontend production template
│   ├── index.html                # HTML5 entry with fonts & meta tags
│   ├── package.json              # Frontend dependencies
│   ├── vercel.json               # Vercel SPA routing rewrites
│   └── vite.config.js            # Vite configuration
│
├── run-all.js                    # Concurrently runs backend & frontend
├── package.json                  # Root orchestration scripts
└── README.md                     # Documentation & Viva answers
```

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- **Node.js** (v18 or higher installed)
- **Git**

### 2. Start Both Backend & Frontend with One Command
From the root workspace directory (`c:/Users/sahil/Downloads/fullstack`):
```bash
node run-all.js
```
Or start them individually in separate terminal windows:

#### Start Backend:
```bash
cd backend
npm install
npm run dev
# Server will run on: http://localhost:5000
```

#### Start Frontend:
```bash
cd frontend
npm install
npm run dev
# Application will open on: http://localhost:3000
```

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api/tasks`

| Method | Endpoint | Description | Request Body Example |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | API Health Check & Info | None |
| **GET** | `/api/tasks` | Get all tasks | None |
| **GET** | `/api/tasks/:id` | Get single task by ID | None |
| **POST** | `/api/tasks` | Create a new task | `{"title": "Plan meals", "description": "Sketch meal plan", "status": "pending"}` |
| **PUT** | `/api/tasks/:id` | Update task details / status | `{"status": "completed"}` |
| **DELETE**| `/api/tasks/:id` | Delete task by ID | None |
| **GET** | `/api/tasks/meta/stats`| Get task statistics | None |

---

## ☁️ Cloud Deployment Guide

### Phase 1: Database Deployment (MongoDB Atlas)
1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. In **Database Access**, create a database user (e.g. `task_user` and secure password).
4. In **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere) so cloud platforms can connect.
5. In **Clusters**, click **Connect** > **Drivers** (Node.js) and copy the connection string:
   ```
   mongodb+srv://task_user:<password>@cluster0.xxxxx.mongodb.net/taskmanager?retryWrites=true&w=majority
   ```

### Phase 2: Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
6. Click **Deploy Web Service**. Render will assign you a public URL (e.g. `https://mern-task-backend.onrender.com`).

### Phase 3: Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository.
3. Configure the project:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://mern-task-backend.onrender.com/api/tasks`
5. Click **Deploy**. Vercel will build the frontend and provide a global URL (e.g. `https://mern-task-manager.vercel.app`).

---


- **Maintainability & Separation of Concerns**: Each component encapsulates its own logic, template, and styles, making debugging and testing localized.
- **Modularity**: Large teams can develop different components in parallel.
- **Declarative UI**: Components describe what the UI should look like for a given state, leaving DOM updates efficiently to React's Virtual DOM.
