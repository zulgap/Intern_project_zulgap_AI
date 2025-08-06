# GitHub Copilot Instructions for ZULGAP AI Intern Project

## Overview
This project is a full-stack web application for an AI-powered chat and workflow assistant, built for an internship program. It is split into a React frontend and a Python backend. The frontend is the main focus and is implemented as a single-page application (SPA) using React Router and Tailwind CSS.

## Architecture
- **Frontend** (`frontend/`):
  - React 19 SPA using React Router DOM for navigation
  - Tailwind CSS for styling
  - All icons are custom SVG components (no external icon libraries)
  - Main routes: `/` (Login), `/home` (Dashboard), `/chat-react` (Chat), `/workflow` (Workflow)
  - Key components: `LoginPage.jsx`, `Home.jsx`, `ChatPageReact.jsx`, `WorkflowPage.jsx`
  - State management is local (React hooks), no Redux or context API
  - No server-side rendering; all logic is client-side
- **Backend** (`backend/`):
  - Python (details not covered here)

## Developer Workflows
- **Start frontend**: `cd frontend && npm start` (runs on port 3000+; check terminal for actual port)
- **Build frontend**: `npm run build`
- **Install dependencies**: `npm install`
- **No custom test scripts**: Only default React Testing Library setup
- **No Redux, no context API**: Use React hooks for all state

## Project Conventions
- **Routing**: All navigation uses React Router DOM. Use `useNavigate()` for redirects (see `LoginPage.jsx` and `Home.jsx`).
- **Authentication**: Demo login only; credentials are hardcoded (`test@test.com`/`test`). Login state is stored in `localStorage` or `sessionStorage` based on the "keep me logged in" checkbox.
- **Icons**: All icons are implemented as inline SVG React components. Do not use Lucide, FontAwesome, or other icon libraries.
- **Styling**: Use Tailwind CSS utility classes. No CSS modules or styled-components.
- **Component Structure**: Each page is a single file in `src/components/`. No deep nesting.
- **No API integration**: All chat and workflow logic is currently mocked or local.

## Examples
- **Login redirect**: On successful login, use `navigate('/home')`.
- **ChatPageReact**: Manages messages with `useState`, renders chat bubbles, and uses custom SVG icons.
- **Home.jsx**: Dashboard with navigation cards, all icons are inline SVG.

## Integration Points
- **No backend API calls in frontend yet**: All data is local or mocked.
- **No external authentication**: Only demo logic.

## Special Notes
- **Line endings**: Windows (CRLF) is used; ignore Git warnings about LF/CRLF.
- **Do not reintroduce Lucide or other icon libraries.**
- **Do not add Redux or context API unless discussed.**

---
For more details, see `frontend/src/components/` for page/component patterns and `frontend/package.json` for dependencies.
