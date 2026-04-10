# Flora Technologies

A complete production-ready website and admin system for Flora Technologies.

## Development vs production configuration

| What | Development | Production |
|------|-------------|------------|
| **Docker Compose file** | `docker-compose.yml` | `docker-compose.prod.yml` (standalone; do not merge with dev file) |
| **Command** | `docker compose up --build` | `docker compose -f docker-compose.prod.yml up --build -d` |
| **Frontend URL** | `http://localhost:3000` | Host `http://127.0.0.1:5050` → nginx → `https://www.floratechnologies.in` |
| **API URL** | `http://localhost:4000` | Host `http://127.0.0.1:5000` → nginx → `https://api.floratechnologies.in` |
| **Admin** | Vite dev `http://localhost:5174` | Built app `http://127.0.0.1:4174` (optional; restrict in prod) |
| **NODE_ENV** | `development` | `production` |
| **Source mounts** | Yes (`./backend`, `./frontend`, `./admin` → hot reload) | No (image-only) |
| **Backend CORS** | Localhost origins (see `docker-compose.yml`) | Public site origins (default in `docker-compose.prod.yml`) |
| **Trust proxy** | Off | `TRUST_PROXY=1` (behind nginx) |
| **Env templates** | Defaults in each `*/.env.example` **Development** section | **Production** sections + root `.env` overrides |

Local development **without Docker**: use `backend/.env.example`, `frontend/.env.example`, `admin/.env.example` as documented in each file’s dev block.

## Folder structure

- `frontend/` - Next.js public website with App Router, SEO-ready pages, and modern UI.
- `backend/` - Node.js + Express REST API with JWT auth, MongoDB models, and data routes.
- `admin/` - React admin panel built with Vite for managing services, portfolio, blog posts, and leads.
- `content.md` - Site content, service copy, industry positioning, pricing, blog topics, and contact information.

## Backend setup

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and update values.
4. `npm run seed` to create the initial admin user and sample data.
5. `npm run dev`

### Backend endpoints

- `GET /api/services`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`
- `GET /api/portfolio`
- `POST /api/portfolio`
- `PUT /api/portfolio/:id`
- `DELETE /api/portfolio/:id`
- `GET /api/blog`
- `POST /api/blog`
- `PUT /api/blog/:id`
- `DELETE /api/blog/:id`
- `GET /api/leads` (protected)
- `POST /api/leads`
- `DELETE /api/leads/:id` (protected)
- `POST /api/auth/login`

## Frontend setup

1. `cd frontend`
2. `npm install`
3. Copy `frontend/.env.example` to `frontend/.env.local` and use the **Development** values (localhost URLs). For production builds, switch to the **Production** block in that file or set vars via `docker-compose.prod.yml`.
4. `npm run dev`

The website is built with Next.js and contains:

- Home page
- Services / service detail pages
- Industry pages
- Portfolio / case studies
- Blog with detail pages
- Contact page with form and WhatsApp integration
- SEO metadata via `app/layout.js`

## Admin panel setup

1. `cd admin`
2. `npm install`
3. Copy `admin/.env.example` to `admin/.env` and set **`VITE_API_URL`** to your API base (development: `http://127.0.0.1:4000/api` as in the file’s **Development** section; production: see the **Production** block or `docker-compose.prod.yml` build args).
4. `npm run dev`

The admin panel includes:

- Login/logout with JWT storage
- Dashboard overview
- Manage services
- Manage portfolio
- Manage blog posts
- Manage leads

## Deployment guidance

Production layout matches **`nginx.conf.example`** on the server:

| Public URL | Proxies to (host) | Docker prod mapping |
|------------|-------------------|----------------------|
| `https://www.floratechnologies.in` | `127.0.0.1:5050` | `frontend` `5050:3000` |
| `https://api.floratechnologies.in` | `127.0.0.1:5000` | `backend` `5000:4000` |

- **Backend:** Set `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `PORT=4000` (inside container), `TRUST_PROXY=1` behind nginx, and `CORS_ORIGINS` with your live site origins (`https://www.floratechnologies.in`, `https://floratechnologies.in`, plus any admin origin). Run `npm run seed` once.
- **Frontend:** `API_URL=http://backend:4000` (or internal URL), `NEXT_PUBLIC_API_URL=https://api.floratechnologies.in`, `NEXT_PUBLIC_SITE_URL=https://www.floratechnologies.in`.
- **Admin:** Build with `VITE_API_URL=https://api.floratechnologies.in/api` (see `admin/.env.example` and `docker-compose.prod.yml` build args).
- **Database:** MongoDB Atlas or self-hosted MongoDB.

The public site loads **services, portfolio, and blog** from the API with a 60s revalidate; if the API is unreachable at build or request time, it falls back to `frontend/lib/siteData.js`. Re-seed after changing sample data so MongoDB stays aligned.

## Docker development setup

Uses **`docker-compose.yml`** only (development stack).

1. Copy `.env.example` to `.env` and set `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
2. Run:
   ```bash
   docker compose up --build
   ```
3. Services: Mongo `27017`, API `4000`, site `3000`, admin dev `5174` — all **localhost** URLs in compose (see table above).

## Docker production setup

Uses **`docker-compose.prod.yml`** only (do not combine with the dev compose file for a clean prod deploy).

```bash
cp .env.example .env   # secrets + uncomment production overrides if defaults are wrong
docker compose -f docker-compose.prod.yml up --build -d
```

- Frontend (nginx upstream): `http://127.0.0.1:5050`
- API (nginx upstream): `http://127.0.0.1:5000` — routes are under `/api/...`
- Admin (optional): `http://127.0.0.1:4174`

## Notes

- `content.md` holds the marketing copy for the site.
- The backend is secured with JWT for admin routes.
- All apps are ready for production build and can be extended with real CMS / file uploads.
