# Storefront — Online Language Learning System

A React-based frontend storefront for an online Japanese language learning platform. It enables users to browse courses, purchase content, track their learning progress, and practice conversation with an AI partner.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [API Modules](#api-modules)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Docker](#docker)
- [Deployment](#deployment)

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.2.0 | UI framework |
| [Vite](https://vitejs.dev/) | 4.5.0 | Build tool & dev server |
| [React Router DOM](https://reactrouter.com/) | 6.17.0 | Client-side routing |
| [Material Tailwind](https://material-tailwind.com/) | 2.1.4 | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3.4 | Utility-first CSS |
| [Axios](https://axios-http.com/) | ^1.11.0 | HTTP client for API calls |
| [Swiper](https://swiperjs.com/) | ^11.2.10 | Carousels & sliders |
| [React PDF](https://react-pdf.org/) | ^10.1.0 | PDF rendering in-browser |
| [Mammoth](https://github.com/mwilliamson/mammoth.js) | ^1.11.0 | DOCX-to-HTML conversion |
| [Font Awesome](https://fontawesome.com/) | ^7.0.1 | Icons |

---

## Project Structure

```
storefront/
├── public/
│   ├── css/              # Global stylesheets
│   ├── img/              # Static images
│   ├── icon/             # App icons
│   ├── logo/             # Brand logos
│   ├── videos/           # Static video assets
│   └── favicon.png
├── src/
│   ├── api/              # API client modules (one per service)
│   ├── components/       # Shared UI components
│   ├── context/          # React context providers
│   ├── data/             # Static/mock data files
│   ├── pages/            # Page-level components (feature folders)
│   │   ├── AI Conversation/
│   │   ├── Courses/
│   │   ├── Home/
│   │   ├── Login-Register/
│   │   ├── Payment/
│   │   └── Profile/
│   ├── utils/            # Utility helpers
│   ├── widgets/          # Reusable UI widgets
│   │   ├── cards/        # Card components
│   │   └── layout/       # Layout wrappers
│   ├── App.jsx           # Root application component
│   ├── main.jsx          # Entry point
│   ├── routes.jsx        # Route definitions
│   └── theme.js          # Theme configuration
├── .env                  # Environment variables
├── Dockerfile
├── genezio.yaml
├── index.html
├── jsconfig.json
├── nginx.conf
├── package.json
├── postcss.config.cjs
├── prettier.config.cjs
├── tailwind.config.cjs
└── vite.config.js
```

---

## Pages & Features

### Home (`src/pages/Home/`)
Landing page presenting the platform overview, featured courses, instructor profiles, and key feature highlights.

### Courses (`src/pages/Courses/`)
| File | Description |
|---|---|
| `Courses.jsx` | Browse & filter the full course catalog |
| `CourseDetail.jsx` | Detailed view of a single course |
| `MyCourse.jsx` | Enrolled courses dashboard |
| `PersonalCourse.jsx` | Personal learning path view |
| `TryCourse.jsx` | Free trial / preview of course content |

### AI Conversation (`src/pages/AI Conversation/`)
Interactive AI conversation partner allowing users to practice Japanese speaking and listening. Driven by `UserConversation.jsx`.

### Login & Register (`src/pages/Login-Register/`)
Authentication pages including sign-in, sign-up (`SigninSignup.jsx`) and role selection after registration (`RegisterRole.jsx`). Wraps logic in `Auth.jsx`.

### Payment (`src/pages/Payment/`)
Checkout flow for purchasing courses.

### Profile (`src/pages/Profile/`)
User profile management, including account details and learning history.

---

## API Modules

All API calls are centralised in `src/api/`, each module managing a specific domain:

| Module | Description |
|---|---|
| `courseApi.js` | Fetch course catalog, details, and search |
| `cartApi.js` | Shopping cart CRUD operations |
| `orderApi.js` | Order creation and history |
| `paymentApi.js` | Payment initiation and verification |
| `profileApi.js` | User profile read/update |
| `progressApi.js` | Learning progress tracking |
| `AIConversationApi.js` | AI conversation session management |
| `notificationApi.js` | User notification retrieval |

Base URLs are configurable via environment variables (see below).

---

## Environment Variables

Create a `.env` file at the project root (a sample is already included):

```env
# Backend-for-Frontend (BFF) endpoints
COURSE_SERVICE_API=http://storefront-bff:8000/api/course-service
USER_SERVICE_API=http://storefront-bff:8000/storefront/user
```

> **Note:** Vite only exposes variables prefixed with `VITE_` to the browser bundle. Rename variables accordingly if direct browser access is needed (e.g. `VITE_COURSE_SERVICE_API`).

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) LTS (v18+)
- npm / yarn / pnpm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

---

## Docker

A `Dockerfile` and `nginx.conf` are included for containerised deployments.

```bash
# Build the image
docker build -t storefront .

# Run the container
docker run -p 80:80 storefront
```

---

## Deployment

Deploy to [Genezio](https://genezio.com/) with one click using the included `genezio.yaml`:

[![Deploy to Genezio](https://raw.githubusercontent.com/Genez-io/graphics/main/svg/deploy-button.svg)](https://app.genez.io/start/deploy)

---

## License

MIT — see [LICENSE](./LICENSE) for details.
