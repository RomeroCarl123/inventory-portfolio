# Deployment Guide (Netlify + Render/Railway)

## 1) Deploy backend (Render or Railway)

Deploy the `server` folder as a Node service.

### Build/Start settings

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Root directory:** `server`

### Required backend environment variables

Use values from `server/.env.example`:

- `PORT=5000` (or platform default)
- `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/inventory?retryWrites=true&w=majority`
- `JWT_SECRET=...`
- `DEMO_USERNAME=demo`
- `DEMO_PASSWORD=demo123`
- `FRONTEND_URL=https://<your-netlify-site>.netlify.app`
- `NETLIFY_URL=https://<your-netlify-site>.netlify.app` (optional)

> Important: include a database name in the URI path (example: `/inventory`) so Mongoose knows where to store your collections.

After deploy, copy backend URL, e.g.:
`https://your-api.onrender.com`

Health check endpoint:
`https://your-api.onrender.com/api/health`

Local backend check:

```bash
npm --prefix server run dev
```

You should see a successful connection log like `MongoDB connected`.

If you want to run with Node directly from the project root, use:

```bash
node server/server.js
```

(`node server.js` only works if your terminal is inside the `server` folder.)

---

## 2) Deploy frontend (Netlify)

Connect this repository to Netlify.

`netlify.toml` is already configured:

- Build command: `npm --prefix client run build`
- Publish directory: `client/dist`
- SPA redirect to `index.html`

### Frontend environment variable (Netlify)

Set in Site settings → Environment variables:

- `VITE_API_BASE_URL=https://your-api.onrender.com/api`

Then trigger deploy.

---

## 3) Verify after deployment

1. Open Netlify site URL.
2. Login using demo credentials: `demo / demo123`.
3. Add a product and confirm dashboard/table updates.
4. If requests fail, verify:
   - backend URL in `VITE_API_BASE_URL`
   - backend `FRONTEND_URL` matches Netlify domain

## 4) Quick troubleshooting

- **Error: `Cannot find module .../server.js`**
  - You ran `node server.js` from the root folder.
  - Use `node server/server.js` from root, or `cd server && node server.js`.

- **Error: invalid MongoDB scheme**
  - Ensure `MONGO_URI` starts with `mongodb://` or `mongodb+srv://`.

- **No DB connection yet**
  - The backend now falls back to demo mode and still starts.
  - Set a valid `MONGO_URI` to persist data in MongoDB.
