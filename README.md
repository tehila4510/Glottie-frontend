<div align="center">

# 🦉 Glottie — AI-Powered English Learning App

### *The fun, effective, and intelligent way to master English*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-RTK_Query-764ABC?style=flat-square&logo=redux)](https://redux-toolkit.js.org)
[![.NET](https://img.shields.io/badge/.NET_API-7185-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

</div>

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Screens & Components](#-screens--components)
- [State Management](#-state-management)
- [Environment Variables](#-environment-variables)
- [Contributing](#-contributing)

---

## Overview

**Glottie** is a full-stack, gamified English learning platform inspired by Duolingo. It adapts to the learner's level, tracks progress across multiple skill areas, and provides an engaging quiz experience with real-time feedback, streaks, hearts, and XP rewards.

The project is built with a **React + Vite** frontend and a **.NET 7 REST API** backend. It uses **Redux Toolkit + RTK Query** for state management and data fetching, **JWT authentication**, and a rich component ecosystem covering everything from placement tests to AI-powered chat with an English teacher.

> 🎯 **Goal:** Help learners go from zero to fluent through bite-sized, adaptive, and beautifully designed lessons.

---

## 🚀 Live Demo

> Backend: `https://localhost:7185`  
> Frontend: `http://localhost:5173`

*To run locally, follow the [Getting Started](#-getting-started) section below.*

---

## ✨ Features

### 🎓 Learning Experience
| Feature | Description |
|---|---|
| **Placement Test** | 6-question adaptive test that determines the user's starting level (A1–C2) |
| **Level Picker** | Manual level selection with visual skill-level descriptions |
| **Skill Cards** | 9 unlockable skills: Vocabulary, Grammar, Verbs, Listening, Reading, Writing, Pronunciation, Phrases, Chat |
| **Lesson Path** | Visual step-by-step learning journey per skill |
| **Quiz Engine** | Multi-type question engine with real-time answer evaluation |
| **AI Chat Teacher** | Conversational AI English teacher powered by the backend |

### 🎮 Gamification
| Feature | Description |
|---|---|
| **Hearts ❤️** | Limited lives per session — lose a heart on each wrong answer |
| **XP System ⭐** | Earn XP for completing sessions, displayed in the sidebar and topbar |
| **Streaks 🔥** | Daily login streaks tracked and displayed |
| **Level Progression** | 6 CEFR levels (A1 → C2), each with an XP threshold |
| **Confetti 🎉** | Animated celebration on quiz completion |

### 📊 Analytics & Progress
| Feature | Description |
|---|---|
| **Progress View** | Bento-grid dashboard with weekly XP bar chart, accuracy rings, skills breakdown |
| **Activity Heatmap** | 25-day practice heatmap |
| **Error Review** | "My Mistakes" page showing every incorrect answer with correct answers |

### 👤 User Management
| Feature | Description |
|---|---|
| **Register / Login** | JWT-based auth with full form validation |
| **Avatar Upload** | Profile image upload with live preview |
| **Profile Edit** | Edit name, email, and password |
| **Persistent Sessions** | Token + user stored in `localStorage`, restored on page refresh |

---

## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 18 | UI framework |
| [Vite](https://vitejs.dev) | 5 | Build tool & dev server |
| [Redux Toolkit](https://redux-toolkit.js.org) | 2 | Global state management |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | — | API calls, caching, optimistic updates |
| [React Router v6](https://reactrouter.com) | 6 | Client-side routing |
| [MUI (Material UI)](https://mui.com) | 5 | Avatar, Badge, Dialog components |
| [React Toastify](https://fkhadra.github.io/react-toastify) | — | Toast notifications |
| [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Native | Text-to-speech for question audio |

### Backend

| Technology | Purpose |
|---|---|
| .NET 7 Web API | REST API (`https://localhost:7185/api`) |
| JWT Bearer Auth | Token-based authentication |
| Entity Framework | ORM for data persistence |

## 🚦 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **.NET 7 SDK** (for the backend)

### 1. Clone the Repository

```bash
git clone https://github.com/tehila4510/React-Project.git
```

### 2. Install Frontend Dependencies

```bash
cd my-react-app
npm install
```

### 3. Start the Backend

```bash
git clone https://github.com/tehila4510/MyProject.git
dotnet run
# API will be available at https://localhost:7185
```

> ⚠️ The backend uses HTTPS with a self-signed dev certificate.  
> Run `dotnet dev-certs https --trust` if you encounter certificate errors.

### 4. Start the Frontend

```bash
cd my-react-app
npm run dev
# App will open at http://localhost:5173
```

### 5. First Run

1. Navigate to `http://localhost:5173`
2. Click **GET STARTED** on the landing screen
3. Create an account (register)
4. Choose your level manually **or** take the placement test
5. Start learning! 🎉

---

## 🏗 Architecture

### Auth Flow

```
Landing → Register Form → API: POST /User/register
                         → Level Picker / Placement Test
                         → API: PUT /User/{id} (set level)
                         → Redux: setUser({ token, user })
                         → localStorage: { token, user }
                         → Navigate to /
```

### Quiz Session Lifecycle

```
QuizPage mounts
  → POST /Quiz/start-session          → sessionId
  → GET  /Quiz/next-question/{sid}/{skillId}  → question
  → [User answers]
  → POST /Quiz/submit-answer          → feedback { isCorrect, correctAnswerText, ... }
  → If wrong: POST /User/lose-heart   → { currentHearts, hasHearts }
  → If hearts === 0: GameOverDialog   → end session
  → Repeat until 10 questions or game over
  → POST /Quiz/end-session/{sid}      → { score, xp, durationInMinutes }
  → GET  /User/{id}                   → refresh user XP/hearts in Redux
  → QuizResult screen
```

### RTK Query Tag Invalidation

| Action | Invalidates |
|---|---|
| `endSession` | `UserSkillProgress`, `Users` |
| `loseHeart` | `Users` |
| `registerUser` | `Users` |

---

## 🖥 Screens & Components

### Landing / Auth
- **Landing** — CTA with "Get Started" and "I already have an account"
- **AuthPage** — Multi-step wizard: `landing → form → level → test`
- **LevelPicker** — 6 animated level cards (A1–C2) with color-coded badges
- **PlacementTest** — Timed 6-question quiz with progress bar and result screen

### Main App (authenticated)
- **HomeView** — Hero section with user stats + skill grid (locked/unlocked)
- **ProgressView** — Bento dashboard: weekly XP chart, performance rings, skills breakdown, heatmap
- **ErrorsView** — All incorrect answers, side-by-side with correct answers
- **ProfileView** — Avatar upload, name/email edit, XP progress bar
- **ChatView** — AI English teacher chat with suggestions, typing indicator, markdown rendering

### Quiz
- **QuizPage** — Session controller (start → question → feedback → result loop)
- **QuizProgress** — Sticky header with progress bar and heart display
- **QuestionFactory** — Renders the right question card based on `questionTypeMask`
- **AnswerFeedback** — Bottom panel (green = correct, red = wrong) with explanation
- **QuizResult** — Score ring SVG animation, XP bar, confetti, stats grid

---

## 🧠 State Management

### Redux Slices

#### `userSlice`
```js
{
  currentUser: { userId, name, email, xp, streak, hearts, currentLevel, avatarUrl },
  token: "Bearer ...",
  isLoggedIn: true
}
```
Persisted to `localStorage` via `createListenerMiddleware`.

#### `quizSlice`
```js
{
  sessionId: number,
  phase: 'idle' | 'loading' | 'question' | 'feedback' | 'result',
  question: QuestionDTO,
  questionCount: number,
  correctCount: number,
  feedback: FeedbackDTO,
  sessionResult: SessionResultDTO
}
```
The `phase` field drives the entire quiz UI rendering.

### RTK Query Endpoints Summary

| Slice | Endpoints |
|---|---|
| `userApi` | `registerUser`, `loginUser`, `updateUser`, `deleteUser`, `getUser` |
| `quizApi` | `startSession`, `endSession`, `getNextQuestion`, `submitAnswer`, `loseHeart` |
| `skillApi` | `getAllSkills`, `getSkillById` |
| `userSkillProgressApi` | `getAllUserSkillProgress`, `getUserSkillProgressById`, CRUD |
| `userAnswerApi` | `getAllUserAnswers`, `getUserAnswerById`, CRUD |
| `sessionApi` | `getAllSessions`, `getSessionById`, CRUD |
| `questionOptionApi` | `getAllQuestionOptions`, CRUD |
| `questionApi` | `getAllQuestions`, CRUD |

---

## ⚙️ Environment Variables

The API base URL is hardcoded in `src/app/baseApi.jsx`:

```js
baseUrl: 'https://localhost:7185/api'
```

To change the backend URL, update this value. For a production build, extract it into a `.env` file:

```env
VITE_API_BASE_URL=https://your-api.com/api
```

Then update `baseApi.jsx`:
```js
baseUrl: import.meta.env.VITE_API_BASE_URL
```
---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Code Style Guidelines

- Components use **PascalCase**, files match the component name
- All API calls go through **RTK Query** — no raw `fetch` in components (except the Chat feature which uses streaming)
- CSS is **component-scoped** — each feature has its own `.css` file
- Use `useSelector` with **memoized selectors** (`createSelector`) for derived data
- Never store sensitive data in `localStorage` beyond `token` and `user`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ and 🦉 by the Glottie team

*Keep learning, keep growing.*

</div>
