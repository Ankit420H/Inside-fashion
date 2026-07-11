# Inside-Fashion E-Commerce Monorepo

Inside-Fashion is a full-stack, production-ready E-commerce ecosystem. This repository is structured as a modern monorepo, cleanly separating the customer frontend, the administrative dashboard, and the Node.js API backend into isolated, scalable applications.

## 🏗️ Architecture

This repository utilizes npm workspaces. The codebase is divided into three distinct applications within the `apps/` directory:

- **`apps/frontend`**: The customer-facing e-commerce storefront (Vite + React + Tailwind).
- **`apps/admin`**: The secure dashboard for inventory and order management (Vite + React + Tailwind).
- **`apps/backend`**: The core API server (Node.js + Express + MongoDB) handling authentication, cart logic, and payment processing (Stripe & Razorpay).

## 🚀 Quick Start (Local Development)

Because this is a monorepo, you can easily install all dependencies for all three projects simultaneously from the root directory.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
You must create a `.env` file in each application directory. 

**`apps/backend/.env`**
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**`apps/frontend/.env`** and **`apps/admin/.env`**
```env
VITE_BACKEND_URL=http://localhost:4000
```

### 3. Run the Ecosystem
To start the development servers for all three applications simultaneously, run:
```bash
npm run dev
```
*(Alternatively, you can start the backend specifically with `npm run start:backend`)*

## ☁️ Deployment Guide (Vercel)

This monorepo is fully optimized for Vercel deployment. You will need to create **three separate projects** in your Vercel dashboard.

1. **Backend Deployment**
   - Import this repository to Vercel.
   - Set the **Root Directory** to `apps/backend`.
   - Vercel will automatically detect the `vercel.json` and deploy the Express app as Serverless Functions.
   - Add all backend environment variables.

2. **Frontend Deployment**
   - Import this repository to Vercel a second time.
   - Set the **Root Directory** to `apps/frontend`.
   - Add `VITE_BACKEND_URL` and set it to your live backend URL from step 1.

3. **Admin Deployment**
   - Import this repository to Vercel a third time.
   - Set the **Root Directory** to `apps/admin`.
   - Add `VITE_BACKEND_URL` and set it to your live backend URL from step 1.

## 🔒 Security Notes
- **Secrets Management:** Never commit `.env` files to version control. If secrets are exposed, rotate them immediately. The `.env` file at the root should not contain production secrets.
- **Admin Access:** The default admin password should be changed immediately after setup. Admin authentication requires a valid JWT with the `admin` role.
- **File Uploads:** Uploaded images are restricted to common image formats (JPEG, PNG, WebP, GIF) and limited to 5MB per file to prevent abuse.
- **CORS:** Ensure `ALLOWED_ORIGINS` is set in production to restrict API access to trusted domains.

## 🧪 Testing and Verification
To verify the integrity of the ecosystem after making changes, run the following commands:
```bash
# Build verification
npm run build --workspace=apps/frontend
npm run build --workspace=apps/admin

# Lint check
npm run lint --workspace=apps/frontend
npm run lint --workspace=apps/admin
```
