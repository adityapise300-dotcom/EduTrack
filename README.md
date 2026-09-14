# EduTrack — Multi-School, Role-Based Portal (Frontend)

Plain **HTML + CSS + vanilla JavaScript**. No frameworks, no bundler, no
build step — open it with any static file server (or double-click
`index.html` for the marketing page; the app itself needs `fetch()`-free
navigation, which it has, so a static server like the one below is only
needed because browsers restrict local file APIs in some setups).

## Run it locally

```bash
cd frontend
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

Any static server works (`npx serve`, nginx, Apache, GitHub Pages, S3 + CloudFront, etc.) — there's nothing to compile.

## Try it — demo login

The app ships with a **mock backend** (`assets/js/mock-data.js` +
`assets/js/api.js`) so it's fully click-through-able before a real API
exists. On the login page, pick **Lincoln High School**, then sign in with
any of these usernames and password `password123`:

| Username           | Role        |
|--------------------|-------------|
| `ananya.student`   | Student     |
| `rohan.teacher`    | Teacher     |
| `sunita.parent`    | Parent      |
| `julian.admin`     | Admin       |
| `priya.accounts`   | Accountant  |
| `vikram.transport` | Transport   |
| `meera.library`    | Librarian   |

Each role lands on its own dashboard with a role-specific sidebar, and every
listed feature page (attendance, results, assignments, fee collection,
routes, book issue/return, etc.) is live and reading from the mock data.

## Connecting a real backend

1. Open `assets/js/config.js` and set `API_BASE` to your server, then flip
   `USE_MOCK_BACKEND` to `false`.
2. Nothing else changes — every page calls a `*.service.js` function, which
   calls `Api.fetchWithToken(path, options)`, which either hits the mock
   router (`assets/js/api.js` → `mockRequest`) or a real `fetch()` against
   `API_BASE + path`. Keep your backend's route shapes matching the paths
   already used in the service files (e.g. `POST /auth/login`,
   `GET /student/attendance`) and the frontend needs no other changes.
3. Each mock route in `api.js` documents the exact JSON shape a real
   endpoint should return — use it as your contract.

## Project structure

```
frontend/
├─ index.html                  Landing page
├─ login.html                  School dropdown + login
├─ forgot-password.html / reset-password.html
├─ unauthorized.html           Shown when a role hits a page it can't access
├─ assets/
│  ├─ css/                     global / layout / components / auth / dashboard + one thin file per role
│  ├─ js/
│  │  ├─ config.js             App constants, API_BASE, role→home map
│  │  ├─ api.js                fetch wrapper + mock backend router
│  │  ├─ auth.js                login / logout / session
│  │  ├─ school.js             tenant (school) list
│  │  ├─ router.js             requireAuth / requireRole guards
│  │  ├─ layout.js             builds header + sidebar + footer per role
│  │  ├─ utils.js              formatters, validators, toast(), dom helpers
│  │  ├─ mock-data.js          in-memory "database" for the mock backend
│  │  ├─ services/             one file per role — the only place fetch happens
│  │  └─ pages/                one render function per page, per role
│  └─ images/
├─ layouts/main-layout.html    reference shell markup
├─ components/                 static reference header/sidebar/footer/modals
└─ student/ teacher/ parent/ admin/ accountant/ transport/ librarian/
   each folder: dashboard.html + that role's feature pages
```

## Notes

- **Frontend guards only.** `router.js` hides pages from the wrong role for
  UX, but a real backend must enforce authorization independently — never
  trust the client.
- **Shared shell, not copy-pasted markup.** Every protected page is a thin
  shell (`<div id="layout-root">…</div>`) — `layout.js` injects the header,
  role-aware sidebar and footer at runtime, so there's one place to change
  the chrome. `layouts/main-layout.html` and `components/*.html` document
  the same structure statically for anyone wiring up a server-side include
  step instead.
- **No localStorage of secrets.** Only a mock bearer token, user id, role,
  and school id are stored client-side, all cleared on logout.
"# EduTrack" 
