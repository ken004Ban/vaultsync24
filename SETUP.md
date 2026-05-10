# VaultSync24 — Full Setup Guide

### From zero to deployed on Netlify

---

## What you're building

A website where you drag a file, get a link, share it with anyone, and the link self-destructs after 24 hours. All backend storage is handled by **Supabase** (free tier — no credit card required).

---

## Part 1: Supabase (the cloud backend)

### Step 1.1 — Create a Supabase account

1. Go to https://supabase.com
2. Click **Start your project**
3. Click **Sign in with GitHub** (you need a GitHub account)
4. Authorize Supabase to access your GitHub
5. You're now in the Supabase dashboard

### Step 1.2 — Create a project

1. Click **New project**
2. **Organization**: Pick or create one (name it whatever)
3. **Name**: `vaultsync24`
4. **Database Password**: Click **Generate** or type one. **Save it somewhere** — you won't need it for this setup but it's good to have.
5. **Region**: Pick the closest one to you (e.g. `us-east-1` for US East Coast, `eu-west-1` for Europe)
6. **Pricing plan**: Make sure **Free** is selected
7. Click **Create new project**
8. Wait ~2 minutes while Supabase provisions your database

### Step 1.3 — Copy your API keys

1. In the Supabase dashboard, go to **Project Settings** (gear icon in left sidebar) → **API**
2. You'll see these three values. Copy all three and keep them handy:

| Name | Example | What it's for |
|------|---------|---------------|
| **Project URL** | `https://abcxyz.supabase.co` | Tells the app where your Supabase project lives |
| **anon public** | `eyJhbGciOiJIUzI1NiIs...` | Used by the browser (safe to expose) |
| **service_role** | `eyJhbGciOiJIUzI1NiIs...` | Used by your server API (keep secret!) |

> **⚠️ Never share the `service_role` key.** It has admin access to everything.

### Step 1.4 — Create the database table

This stores file information: name, size, expiration time, etc.

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the following SQL:

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT,
  storage_path TEXT NOT NULL,
  url TEXT,
  uploaded_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);
```

4. Click **Run** (or press Ctrl+Enter)
5. You should see green text: **"Success. No rows returned"**
6. Optional — verify it worked: click **Table Editor** in the left sidebar, you should see a `files` table with 0 rows

### Step 1.5 — Create the storage bucket

This is where the actual file bytes live.

1. In Supabase dashboard, click **Storage** in the left sidebar
2. Click **New bucket**
3. **Name**: `uploads` (must be exactly this — all lowercase)
4. **Public bucket**: Leave **OFF** (private)
5. Click **Create bucket**
6. You should see the `uploads` bucket appear in the list

> The bucket is private. Nobody can access files without a signed URL, which only your app can generate.

---

## Part 2: Configure the app locally

### Step 2.1 — Create `.env.local`

In the project folder, create a file called `.env.local` with this content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Replace the three values with what you copied in **Step 1.3**.

> **Example of what it should look like:**
> ```
> NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklm.supabase.co
> NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
> ```

### Step 2.2 — Test locally

Open a terminal in the project folder and run:

```bash
npm run dev
```

Open your browser to **http://localhost:3000**

### Step 2.3 — Run the full test

| Test | What to do | Expected result |
|------|-----------|-----------------|
| Upload | Drag a file onto the upload zone or click to browse | Progress bar fills, green notification says "uploaded successfully" |
| Dashboard | After upload, a FileCard appears | Shows file name, size, countdown timer, Download + Copy Link buttons |
| Download | Click the **Download** button on a FileCard | Opens the file in a new tab (or downloads it, depending on file type) |
| Copy Link | Click the **Copy Link** button | Copies a URL like `http://localhost:3000/download/abc-123` |
| Visit Share Link | Open that URL in a new tab | Shows a download page with file info and a big Download button |
| Expired File | Wait 24 hours (or change `expires_at` in Supabase to a past time) | Shows "Link Expired" message |

> **For the file to appear in Supabase:**
> After uploading, go to Supabase dashboard → **Table Editor** → `files` table. You should see a row with your file's info. Then go to **Storage** → `uploads` bucket — the file should be there.

If all tests pass, the app is fully working locally. Proceed to deploy.

---

## Part 3: Deploy to Netlify

### Step 3.1 — Push code to GitHub

Make sure your code is pushed to a GitHub repository.

```bash
git add .
git commit -m "Switch from Firebase to Supabase"
git push
```

### Step 3.2 — Connect Netlify to your repo

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Click **Deploy with GitHub**
4. Authorize Netlify to access your repos
5. Find and select the `vaultsync24` repository
6. **Build settings** — Netlify auto-detects Next.js. The defaults should be:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
7. Click **Deploy site**
8. Wait ~2 minutes for the first deploy

The deploy will **succeed** but the app won't work yet — you need to add environment variables.

### Step 3.3 — Add environment variables on Netlify

1. In the Netlify dashboard for your site, go to **Site configuration** → **Environment variables**
2. Click **Add a variable**
3. Add all three:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service_role key |

4. Click **Save**

### Step 3.4 — Redeploy

1. In the Netlify dashboard, go to **Deploys**
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait ~2 minutes

### Step 3.5 — Test on the live site

1. Netlify gives your site a URL like `https://vaultsync24.netlify.app`
2. Open it in your browser
3. Run through the same tests from **Step 2.3**:

| Test | Expected result |
|------|-----------------|
| Upload a file | Green success notification |
| Copy the share link | URL starts with `https://your-site.netlify.app/download/...` |
| Open share link in incognito | Download page shows file info and Download button |

> **Pro tip:** Test the share link in an incognito/private window or on a different device. This simulates what happens when you send the link to someone else.

---

## Part 4: Architecture summary

### Data flow

```
User drags file onto page
  │
  ▼
POST /api/upload  (your Next.js server on Netlify)
  │
  ├── Uploads file bytes → Supabase Storage bucket "uploads"
  │
  └── Saves metadata → Supabase PostgreSQL table "files"
                         ┌──────────────────────────────┐
                         │ id: "abc-123"                 │
                         │ name: "report.pdf"            │
                         │ size: 2048576                 │
                         │ storage_path: "abc-123_report.pdf"
                         │ url: "https://...signed-url"  │
                         │ uploaded_at: 1746832000000    │
                         │ expires_at: 1746918400000     │
                         └──────────────────────────────┘
  │
  ▼
Returns file info + signed URL to the browser
  │
  ▼
FileCard shows download button + share link
  │
  ▼
You copy link: https://site.app/download/abc-123
  │
  ▼
Friend opens link
  │
  ▼
GET /api/files/abc-123  (your Next.js server)
  │
  ├── Looks up "abc-123" in Supabase "files" table
  ├── Checks: is expires_at > now? If no → 410 "Expired"
  ├── Generates a fresh signed URL (valid 24h)
  │
  ▼
Friend sees download page with green Download button
  │
  ▼
Friend clicks Download → opens signed URL → file downloads from Supabase Storage
```

### File structure

```
src/
├── app/
│   ├── api/
│   │   ├── upload/route.ts          POST — uploads file + saves metadata
│   │   └── files/[fileId]/route.ts  GET — fetches file metadata for share link
│   ├── download/[fileId]/page.tsx   Shareable download page UI
│   └── page.tsx                     Homepage — upload zone + file list
├── lib/
│   ├── supabase.ts                  Supabase clients (anon + admin)
│   ├── types.ts                     TypeScript types
│   └── utils.ts                     Helper functions
├── components/
│   ├── FileCard.tsx                 File card with download/copy-link/timer
│   ├── FileUploadZone.tsx           Drag-and-drop upload zone
│   ├── Notification.tsx             Toast notifications
│   └── ProgressBar.tsx              Upload progress
└── hooks/
    └── useFileUpload.ts             Upload hook (available but unused)
```

---

## Part 5: Supabase free tier limits

| Resource | Free limit | Real-world meaning |
|----------|------------|-------------------|
| Database | 500 MB | File metadata takes ~200 bytes per file. That's **2.5 million files** worth. |
| File Storage | 1 GB | ~20 full-length videos. ~2000 high-res photos. ~10,000 documents. |
| Bandwidth | 2 GB/month | ~2000 file downloads of 1 MB each. ~400 downloads of 5 MB each. |
| API requests | Unlimited | No limit on how many times you can call Supabase. |

When you hit a limit, Supabase **pauses** — it doesn't charge you. You get an email saying "upgrade to continue." There's no surprise bill.

---

## Part 6: Troubleshooting

### Build fails on Netlify

**Error: `supabaseUrl is required`**
→ You need to set environment variables on Netlify (Step 3.3) and redeploy with cache cleared (Step 3.4).

**Error: `Command failed with exit code 1`**
→ Check the deploy log. Most likely a missing dependency. Make sure you committed `package-lock.json`.

### Upload fails on live site

**Error toast: "Storage not configured"**
→ The `SUPABASE_SERVICE_ROLE_KEY` is missing or wrong in Netlify env vars.

**Error toast: "Upload failed"**
→ Open browser dev tools (F12) → Console tab. Check if there's a network error. Common causes:
  - Supabase bucket `uploads` doesn't exist
  - The `files` table wasn't created in SQL Editor

### Share link shows "File not found"

- The file ID in the URL doesn't match any row in the `files` table
- Upload a new file and copy the fresh link

### Share link shows "Link Expired"

- The file's 24 hours are up. Upload it again.
- To test immediately, go to Supabase → Table Editor → `files` → edit the `expires_at` column to a future timestamp

### I accidentally exposed my service_role key

1. Go to Supabase dashboard → **Project Settings** → **API**
2. Click **Rotate service_role key** → generates a new one
3. Update the new key in Netlify env vars (Step 3.3) and redeploy (Step 3.4)

---

## Part 7: Quick reference

### Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### SQL table

```sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  type TEXT,
  storage_path TEXT NOT NULL,
  url TEXT,
  uploaded_at BIGINT NOT NULL,
  expires_at BIGINT NOT NULL
);
```

### Storage bucket

- Name: `uploads`
- Type: **Private** (not public)
- Files stored at: `uploads/{uuid}_{filename}`

### Commands

| Action | Command |
|--------|---------|
| Start locally | `npm run dev` |
| Build locally | `npm run build` |
| Check types | `npx tsc --noEmit` |
| Deploy to Netlify | Push to GitHub → auto-deploys |
| Force redeploy | Netlify → Deploys → Trigger deploy → Clear cache |

// m19775@M19775
