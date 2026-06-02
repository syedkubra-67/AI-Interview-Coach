# AI Interview Coach - Production-Ready SaaS Platform

AI Interview Coach is a premium SaaS application designed to help job seekers practice technical, HR, and behavioral interviews, analyze resumes for ATS optimization, audit vocabulary pacing, and generate customized learning tracks.

This application is built with a **Node.js/Express** backend, a **React/Vite** frontend (styled with Tailwind CSS and Chart.js), and is integrated with **Google Gemini 1.5 Flash** for high-quality evaluations.

---

## Complete Project Folder Structure

```text
ai-interview-coach/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                 # MongoDB connection
│   │   │   └── ai.js                 # Gemini configuration
│   │   ├── controllers/              # Business controllers (auth, interview, resume, roadmap, etc.)
│   │   ├── middleware/               # Route security, rate limiters, & error handlers
│   │   ├── models/                   # Mongoose schemas (User, Interview, Report, etc.)
│   │   ├── routes/                   # Router definitions
│   │   ├── utils/                    # PDF parsing and Gemini API prompts
│   │   └── server.js                 # Express bootstrapper
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Layout, sidebar, buttons, cards
│   │   ├── context/                  # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/                    # Views (Dashboard, Session, Resume, Roadmaps, Admin)
│   │   ├── services/                 # Axios clients
│   │   ├── App.jsx                   # React Router configurations
│   │   ├── index.css                 # Custom glassmorphic directives
│   │   └── main.jsx                  # React DOM mounting
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
└── .github/
    └── workflows/
        └── ci-cd.yml                 # Automation pipeline
```

---

## Database Schemas (MongoDB Models)

We use Mongoose schemas to represent data:

1. **User**: Credentials, active streak days, total XP, and profile status.
2. **Interview**: Mock questions, applicant answers, and granular scores per response.
3. **Report**: Aggregated assessment scorecard, listing strengths, weaknesses, and a development plan.
4. **ResumeAnalysis**: Captured technical tools, ATS compliance match rate, missing skills, and layout suggestions.
5. **Roadmap**: Customized 6-week study schedule with weekly projects and target industrial credentials.
6. **Achievement**: badge rewards.
7. **UserAchievement**: Maps users to badges.
8. **Leaderboard**: XP and streak caches.

---

## API Endpoints Reference

### Authentication Routing (`/api/auth`)
- `POST /register`: Registers user, returns JWT.
- `POST /login`: Validates user credentials, returns JWT.
- `GET /me`: Fetches profile details (Protected).
- `POST /forgotpassword`: Triggers mock email reset token (Simulation).
- `PUT /resetpassword/:resettoken`: Validates token and updates credentials.

### Interview Routing (`/api/interviews`)
- `POST /generate`: Creates interview session, returns 10 questions (Protected).
- `POST /evaluate`: Scores questions, writes report, yields user XP and updates streaks (Protected).
- `GET /report/:id`: Retrieves detailed performance metrics (Protected).
- `GET /history`: Returns a log of all previous attempts (Protected).

### Resume Scanning (`/api/resumes`)
- `POST /upload`: Uploads a PDF resume, parses content, and evaluates ATS matches (Protected).
- `GET /history`: Returns previous resume scan logs (Protected).

### Career Pathways (`/api/roadmaps`)
- `POST /generate`: Computes learning timeline, weekly tasks, and project topics (Protected).
- `GET /latest`: Returns latest generated roadmap (Protected).

### Leaderboards (`/api/leaderboard`)
- `GET /`: Returns top XP and top Streak leaders (Protected).
- `GET /my-rank`: Computes user's relative ranks and user totals (Protected).

### System Admin (`/api/admin`)
- `GET /stats`: Returns registrations, active stats, aggregate scores, and simulated MRR (Admin Protected).

---

## Installation Guide (Local Development)

### 1. Prerequisite Checklist
- Install [Node.js](https://nodejs.org/) (Version >= 18.x recommended).
- Install [MongoDB](https://www.mongodb.com/) (Local Community edition or an Atlas URI cloud cluster).

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Fill in environmental keys:
   - Provide a valid `MONGO_URI` (default is `mongodb://127.0.0.1:27017/ai-interview-coach`).
   - Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/) and paste it in `GEMINI_API_KEY`.
5. Launch the backend API:
   - Production mode: `npm start`
   - Dev mode (live reloading): `npm run dev`

### 3. Frontend Setup
1. Open another terminal in the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Set your environment url if the backend port is customized (Default is `http://localhost:5000/api`):
   - You can create `.env.local` containing: `VITE_API_URL=http://localhost:5000/api`
4. Spin up the Vite development server:
   ```bash
   npm run dev
   ```

---

## Deployment Guide (Cloud Infrastructure)

### Backend Hosting on Render
1. Create a free account at [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. Set up the service properties:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. In the **Environment Variables** tab, add:
   - `MONGO_URI`: `your_mongodb_connection_string`
   - `JWT_SECRET`: `your_jwt_secret_token`
   - `GEMINI_API_KEY`: `your_google_gemini_api_key`
6. Click **Deploy Web Service**.

### Frontend Hosting on Vercel
1. Create a free account at [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: `your_render_backend_api_url/api`
5. Click **Deploy**.
