<div align="center">

<img src="docs/assets/logo.png" alt="Glottie Logo" width="280" />

# 🦉 Glottie — Frontend

### The React client for an AI-powered, gamified English learning platform

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Rolldown-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![MUI](https://img.shields.io/badge/UI-Material_UI-007FFF?style=for-the-badge&logo=mui&logoColor=white)](https://mui.com)

**Backend repository:** [tehila4510/glottie-backend](https://github.com/tehila4510/glottie-backend) (C# .NET Web API, SQL Server, Google Gemini)

</div>

---

## 📌 Overview

**Glottie** helps people learn English through short, adaptive practice sessions. This repository is the **React client**: it renders the learning experience (quizzes, placement test, progress dashboard, AI tutor chat) and talks to the Glottie backend over a JWT-secured REST API.

<div align="center">
<img src="docs/assets/mascots.png" alt="Glottie mascots" width="460" />
</div>

---

## ✨ Highlights

- **9 interactive question types** rendered by a single `QuestionFactory`, which reads a **bitmask** sent by the server to decide which component to show.
- **Quiz flow as a state machine** (`loading → question → feedback → result`) managed in a dedicated Redux slice, with guards against accidental exit and duplicate session starts.
- **RTK Query data layer** with one shared base API, tag-based cache invalidation, automatic `Authorization` headers, and automatic logout on `401`.
- **Global error handling** through a custom middleware that turns failed requests into toast notifications.
- **Speech built in:** questions are read aloud using the browser's Web Speech API.
- **Progress analytics** with charts, plus a "My Mistakes" review page.

---

## 🧩 Features

| Area | What the user gets |
|---|---|
| **Onboarding** | Landing page, registration and login, a placement test, or manual level selection |
| **Learning** | Skill cards for 9 areas (vocabulary, grammar, verbs, listening, reading, writing, pronunciation, phrases, chat) and a visual lesson path |
| **Quiz engine** | Multiple choice, multiple answer, text entry, listening, ordering, translation, pronunciation, matching, and drag-and-drop questions with instant feedback |
| **Gamification** | XP, hearts, daily streak, level progress, and a result screen at the end of every session |
| **Progress** | Charts per skill and over time (Recharts) |
| **My Mistakes** | Every wrong answer next to the correct one |
| **AI tutor** | A chat with an English teacher powered by Google Gemini through the backend |
| **Profile** | Edit details and upload an avatar |

<div align="center">

<img src="docs/assets/home.png" width="130" title="Home"/>
<img src="docs/assets/progress.png" width="130" title="Progress"/>
<img src="docs/assets/errors.png" width="130" title="My Mistakes"/>
<img src="docs/assets/profile.png" width="130" title="Profile"/>
<img src="docs/assets/chat2.png" width="130" title="AI Tutor"/>

</div>

---

## 🛠 Tech Stack

| Technology | Role |
|---|---|
| **React 19** | UI library |
| **Vite (Rolldown build)** | Dev server and bundler |
| **Redux Toolkit + RTK Query** | State management, data fetching, and caching |
| **React Router 7** | Routing and protected routes |
| **Material UI** | Component library and icons |
| **Framer Motion** | Animations |
| **Recharts** | Progress charts |
| **React Toastify** | Notifications |
| **Web Speech API** | Reading questions aloud |

---

## 📂 Project Structure

```
my-react-app/src/
├── app/            → Store, shared base API, router, sidebar, landing
├── auth/           → Login, registration, level picker, placement test
├── Pages/          → Home screen
└── features/
    ├── Quiz/       → QuizPage, QuestionFactory, 9 question-type components, quiz slice
    ├── Chat/       → AI tutor chat
    ├── User/       → Profile, avatar, user slice
    ├── UserSkillProgress/ → Progress dashboard
    ├── UserAnswer/ → "My Mistakes"
    ├── Session/ · Skill/ · Lesson/ · Question/ · Option/
    └── (each feature keeps its own components and Redux API)
```

---

## 🧠 State Management

- **`baseApi`** — a single RTK Query API that attaches the JWT to every request and dispatches `logout` when the server answers `401`.
- **Persistence middleware** — a listener middleware keeps the token and current user in `localStorage` in sync with the store, so users stay signed in after a refresh.
- **Error middleware** — rejected requests are converted into readable toast messages.
- **`quizSlice`** — tracks the session ID, current question, answer feedback, and results through the quiz phases.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+**
- The [Glottie backend](https://github.com/tehila4510/glottie-backend) running locally (it serves the API at `https://localhost:7185` by default)

### Run the client

```bash
git clone https://github.com/tehila4510/glottie-frontend.git
cd glottie-frontend/my-react-app
npm install
npm run dev
# Open http://localhost:5173
```

### Pointing to a different API
By default the client talks to `https://localhost:7185/api`. To use another backend, copy `my-react-app/.env.example` to `my-react-app/.env` and set:

```bash
VITE_API_URL=https://your-backend-host/api
```

### First use
1. Click **GET STARTED** and register.
2. Pick a level manually or take the placement test.
3. Choose a skill and start practicing.

---

## 🗺 Roadmap

- Add component tests for the quiz flow.
- Add a deployed demo.

---

<div align="center">

### 🦉 Built with care

**React · Redux Toolkit · RTK Query · Material UI**

*Keep learning, keep growing.*

</div>
