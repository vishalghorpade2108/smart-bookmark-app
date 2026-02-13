# Smart Bookmark App 🚀

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![Supabase](https://img.shields.io/badge/Supabase-Realtime-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-blue)

A **full-stack Bookmark Manager** built with **Next.js**, **Supabase**, and **Tailwind CSS**.  
Manage your bookmarks in real-time with Google authentication — private and synced across tabs.

---

## 🔥 Features

- 🔐 **Google OAuth login** (No email/password)
- 📌 **Add bookmarks** (Title + URL)
- ❌ **Delete bookmarks** with loading spinner
- ⚡ **Realtime updates** across tabs
- 🎨 **Clean, responsive UI** with Tailwind CSS
- ⏳ **Loading states** and error handling
- 📱 Mobile-friendly design

---

## 🛠 Tech Stack

- **Frontend:** Next.js 14 (App Router)  
- **Backend:** Supabase (Auth, Database, Realtime)  
- **Styling:** Tailwind CSS  
- **Deployment:** Vercel  

---

## 📂 Project Structure
```
bookmark/
│
├── app/
│   ├── page.tsx              ← Login page
│   └── dashboard/
│       └── page.tsx          ← Dashboard with bookmarks
│
├── lib/
│   └── supabaseClient.ts     ← Supabase client setup
│
├── .env.local                ← Environment variables (DO NOT COMMIT)
├── .gitignore
├── package.json
└── README.md
```



---

## 🗄 Database Schema

Create a table in Supabase called `bookmarks` with the following columns:

| Column      | Type      | Description |
|------------|-----------|-------------|
| id         | uuid      | Primary key |
| title      | text      | Bookmark title |
| url        | text      | Bookmark URL |
| user_id    | uuid      | Foreign key to `auth.users` |
| created_at | timestamp | Default: now() |

Enable **Realtime** on this table to sync bookmarks across tabs instantly.

---

## 🌍 Deployment

Deploy to **Vercel**:

1. Push code to GitHub  
2. Connect the repository to Vercel  
3. Add environment variables in the Vercel dashboard (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)  
4. Deploy 🚀  

> Example live URL: `https://smart-bookmark-app-tau-five.vercel.app/`



## 📝 Problems & Solutions

| Problem | How I Solved It |
|---------|----------------|
| Bookmarks did not appear in other tabs immediately | Implemented **Supabase Realtime subscription** (`postgres_changes`) to sync inserts, updates, and deletes in real-time. |
| Delete button did not show feedback | Added a **loading spinner** and disabled the button while the delete request was processing. |
| Empty input fields could submit | Added **input validation** and displayed an error message when Title or URL is empty. |
| Text visibility issues on dark/light backgrounds | Adjusted **Tailwind CSS classes** for proper contrast so text is readable. |
| URLs without `http://` or `https://` could break | Added **simple validation** to ensure URLs are complete. |
| OAuth login URL shows `#access_token` in production on Vercel | Used `supabase.auth.getSessionFromUrl()` in `useEffect` to handle redirect properly and cleaned the URL after login. |





## 👨‍💻 Author

**Vishal Ghorpade**  
