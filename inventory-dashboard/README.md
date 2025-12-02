# AWS Inventory Dashboard (React + Vite)

A small React inventory dashboard designed for AWS hands-on practice. It demonstrates:

- A cloud-hosted style inventory UI (products, stock levels, alerts)
- AWS Amplify hosting + Cognito-style authentication (with demo-mode fallback)
- REST API integration via `axios`
- Basic charts using **Recharts**
- Styling with **Tailwind CSS**

This project assumes that real REST APIs will eventually exist, but you can test everything locally using the included **json-server mock API**.

## Tech Stack

- React 18 (functional components + hooks, JavaScript only)
- Vite
- React Router (`react-router-dom`)
- Tailwind CSS
- axios
- Recharts
- AWS Amplify (Auth)
- json-server (for local mock API)

Project entrypoint: `src/main.jsx`  
Main app: `src/App.jsx`

## Folder Structure (key parts)

- `src/main.jsx` – bootstraps React and imports Tailwind styles
- `src/App.jsx` – routing, layout, protected routes
- `src/api/index.js` – shared `axios` instance
- `src/api/products.js` – API helpers: products, alerts, sales trends
- `src/context/UserContext.jsx` – user/auth state (Amplify + demo mode)
- `src/context/ToastContext.jsx` – simple toast notifications
- `src/components/` – UI building blocks (header, sidebar, cards, modals, chart, alerts)
- `src/pages/` – route pages: Dashboard, Products, Product Detail, Alerts, Settings, Login
- `src/styles/index.css` – Tailwind `@apply` utilities and custom classes
- `.env.example` – example environment variables
- `mockServer.js` – json-server based mock backend
- `db.json` – sample data for mock backend

---

## 1. Setup & Installation

Prerequisites on your own machine:

- Node.js 18+ (which includes `npm`)

Then:

```bash
cd inventory-dashboard
npm install
```

To run the dev server:

```bash
npm run dev
```

By default Vite will print a URL like `http://localhost:5173`. Open that in your browser.

> Note: In this environment Node is not installed, but the project files and configuration are ready for you to use on your own machine.

---

## 2. Environment Variables

Copy `.env.example` to `.env.local` (or `.env`) and adjust as needed:

```bash
cp .env.example .env.local
```

`./.env.example` contains:

```bash
# API Configuration
# Vite-style env var that holds the API base URL.
# Mirrors the classic CRA-style REACT_APP_API_BASE name while still
# starting with VITE_ so Vite can expose it to the client bundle.
VITE_REACT_APP_API_BASE=https://api.example.com

# AWS Amplify / Cognito Configuration
# Get these values from AWS Console > Cognito > User Pools
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
VITE_COGNITO_APP_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Set to 'true' to enable demo mode (mock auth)
VITE_DEMO_MODE=false
```

### API Base URL

The React app reads the base URL from `VITE_REACT_APP_API_BASE` in `src/api/index.js`:

```js
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  'https://api.example.com';
```

- For Vite: **use `VITE_REACT_APP_API_BASE`** in your `.env` file.
- Conceptually this corresponds to a CRA-style `REACT_APP_API_BASE` variable.

To point the app at your real backend:

```bash
# .env.local
VITE_REACT_APP_API_BASE=https://your-real-api.example.com
```

Then restart `npm run dev` so Vite picks up the new env values.

---

## 3. Amplify & Cognito Auth Configuration

Authentication is handled in `src/context/UserContext.jsx` using AWS Amplify’s Auth APIs. It supports two modes:

- **Cognito mode (real auth)** – uses your Cognito User Pool details
- **Demo mode** – mock login using localStorage (no AWS account required)

### Where Amplify is configured

`src/context/UserContext.jsx`:

```js
import { Amplify } from 'aws-amplify';
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const amplifyConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },
};

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
if (!isDemoMode) {
  Amplify.configure(amplifyConfig);
}
```

When **not** in demo mode, `login()` calls `signIn({ username, password })` and stores the Cognito ID token in `localStorage` for API calls.

### Steps to configure Cognito

1. **Create a User Pool** in AWS Cognito (or use an existing one).
2. In the Cognito console, note the:
   - **User Pool ID**
   - **Region**
   - **App client ID** (from the “App clients” section)
3. Update your `.env.local`:

   ```bash
   VITE_AWS_REGION=us-east-1
   VITE_COGNITO_USER_POOL_ID=us-east-1_abc123XYZ
   VITE_COGNITO_APP_CLIENT_ID=1234567890abcdefghijkl
   VITE_DEMO_MODE=false
   ```

4. Restart `npm run dev`.
5. Use a real Cognito username/password on the **Login** page.

### Demo / Mock Login

If you set `VITE_DEMO_MODE=true` in `.env.local`:

- Amplify is **not** configured.
- `login()` writes a mock user object and fake token into `localStorage`.
- Any username/password will work.
- The Login page shows a **Quick Demo Login** button to fill in sample credentials.

This is ideal for AWS labs where you don’t want to provision Cognito yet.

---

## 4. Pages & Features

### Authentication

- `src/pages/Login.jsx` – login form using the `UserContext`.
  - In Cognito mode, calls `signIn` from `aws-amplify/auth`.
  - In demo mode, performs a mock login.
- `src/context/UserContext.jsx` – stores `user`, `isAuthenticated`, and exposes `login` / `logout`.
- Protected routes are implemented in `src/App.jsx` via a `ProtectedRoute` wrapper.

### Layout / Navigation

- `Header` (`src/components/Header.jsx`): app name, AWS demo subtitle, logged-in user, Logout button.
- `Sidebar` (`src/components/Sidebar.jsx`): navigation links for Dashboard, Products, Alerts, Settings.
- `App.jsx` wires these into a layout for authenticated routes.

### Dashboard (`/`)

- Top **summary cards**:
  - Total products
  - Low-stock items (stock <= threshold)
  - Total stock value (∑ stock × price)
  - Active alerts count
- **Sales trend chart** (30 days) using Recharts (`ChartSales.jsx`).
- **Recent alerts list** (top 5) using `AlertList.jsx`.

### Products (`/products`)

- Fetches `GET /products` via `getProducts()` in `src/api/products.js`.
- Two view modes: **grid cards** (default) and **table view**.
- Each product shows: name, SKU, stock, threshold, price, last sold date.
- **Low-stock badge** when `stock <= threshold`.
- **Adjust Stock** button opens `AdjustModal.jsx`.
- Optimistic UI: stock is updated locally, then confirmed with the `POST /products/:id/adjust` response. On failure, the list is refetched and an error toast is shown.

### Product Detail (`/products/:id`)

- Fetches `GET /products/:id`.
- Shows detailed card with stock, threshold, unit price, total value, last sold date.
- **Adjust Stock** button reuses `AdjustModal.jsx` and the same optimistic update pattern.
- Includes a low-stock alert card if stock is below threshold.

### Alerts (`/alerts`)

- Fetches `GET /alerts` and `GET /products`.
- `AlertList.jsx` resolves each alert’s `productId` to a product name locally.
- Shows message and human-readable timestamp.

### Settings (`/settings`)

- Shows current user information.
- Shows whether you’re in **Demo Mode** or **AWS Cognito** mode.
- Displays current (or placeholder) Amplify/Cognito env values and steps to retrieve them from AWS.
- Displays the current API base URL and instructions to change it.
- Includes a brief **Deploy to AWS Amplify Hosting** checklist.

---

## 5. REST API Contract

The frontend assumes the following endpoints relative to `VITE_REACT_APP_API_BASE`:

- `GET /products` → `[{ id, name, sku, stock, threshold, price, lastSoldDate }]`
- `GET /products/:id` → single product object
- `POST /products/:id/adjust` with JSON body:

  ```json
  { "delta": 5, "reason": "Restocked from supplier" }
  ```

  Returns the **updated product**.

- `GET /alerts` → `[{ id, productId, message, createdAt }]`
- `GET /sales/trends?range=30` → `[{ date: "YYYY-MM-DD", sales: number }]`

All of these are implemented against the mock server as well.

---

## 6. Example cURL Commands

You can test your real or mock API with these examples. Replace the base URL as needed.

### List products

```bash
curl https://api.example.com/products
```

Example response (truncated):

```bash
[
  {
    "id": 1,
    "name": "Laptop Pro 15",
    "sku": "LTP-15-PRO",
    "stock": 12,
    "threshold": 5,
    "price": 1499,
    "lastSoldDate": "2025-11-20"
  }
]
```

### Get single product

```bash
curl https://api.example.com/products/1
```

### Adjust stock

```bash
curl -X POST \
  https://api.example.com/products/1/adjust \
  -H "Content-Type: application/json" \
  -d '{"delta": 5, "reason": "Restocked from supplier"}'
```

### List alerts

```bash
curl https://api.example.com/alerts
```

### Sales trends (30 days)

```bash
curl "https://api.example.com/sales/trends?range=30"
```

When using the local mock server, replace `https://api.example.com` with `http://localhost:4000`.

---

## 7. Local Mock API with json-server

This repo ships with `json-server` and a simple `mockServer.js` so you can run the full app locally without a real backend.

### Start the mock API

From the project root:

```bash
npm install
npm run mock:server
```

This starts a mock API at `http://localhost:4000` serving:

- `GET /products`
- `GET /products/:id`
- `POST /products/:id/adjust`
- `GET /alerts`
- `GET /sales/trends` (mapped from the `sales_trends` collection)

Backed by `db.json` sample data.

### Point the frontend at the mock API

Set the API base in `.env.local`:

```bash
VITE_REACT_APP_API_BASE=http://localhost:4000
VITE_DEMO_MODE=true
```

Then start the React app in another terminal:

```bash
npm run dev
```

You now have a fully working end-to-end demo with:

- Mock login (no Cognito required)
- Products list, product detail, alerts
- Stock adjustment using the `/products/:id/adjust` endpoint
- Sales trend chart using `/sales/trends`

---

## 8. Deploying to AWS Amplify Hosting (High Level)

1. **Push code to Git** (GitHub, GitLab, or Bitbucket).
2. Go to the **AWS Amplify Console**.
3. Click **New app → Host web app**.
4. Connect your Git repository and select the branch.
5. Amplify will auto-detect a Vite build; if you need to override:
   - Build command: `npm run build`
   - Output directory: `dist`
6. In the Amplify Console, configure **Environment variables**:
   - `VITE_REACT_APP_API_BASE`
   - `VITE_AWS_REGION`
   - `VITE_COGNITO_USER_POOL_ID`
   - `VITE_COGNITO_APP_CLIENT_ID`
   - (Optional) `VITE_DEMO_MODE`
7. Save and deploy. Amplify will build the app and give you a public URL.

For more details, see the link on the **Settings** page.

---

## 9. Testing & Demo Ideas

- Enable **demo mode** and use the mock API to explore the UI:
  - Try adjusting stock up and down and watch low-stock badges and alerts.
  - Observe optimistic UI updates and toast notifications.
  - Resize the window to see the responsive layout.
- Switch to real Cognito and a real API later by:
  - Turning `VITE_DEMO_MODE` to `false`.
  - Pointing `VITE_REACT_APP_API_BASE` at your production API.

This makes the app a good starting point for AWS labs focused on:

- Amplify Hosting
- Cognito User Pools
- Securing REST APIs with JWT tokens
- Observing how a React SPA talks to cloud-hosted services.
