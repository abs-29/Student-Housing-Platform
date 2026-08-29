# Database Setup Guide

## Option 1: MongoDB Atlas (EASIEST - Recommended) ⭐

MongoDB Atlas is the **free cloud version** of MongoDB. No local installation needed!

### Steps:
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" and create free account
3. Create a new Project
4. Create a Cluster (M0 - Free tier)
5. Create a Database User (save username/password)
6. Get connection string
7. Update `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/student-housing?retryWrites=true&w=majority
```

**That's it!** No code changes needed. Server works exactly the same.

---

## Option 2: Firebase Quicker Start

Firebase is a Google cloud service with a generous free tier.

### Steps:
1. Go to: https://console.firebase.google.com
2. Create a new project
3. Go to Realtime Database → Create Database (Start in test mode)
4. Get your database URL
5. Go to Project Settings → Service Accounts → Generate new private key
6. Add to `.env`:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_CLIENT_EMAIL=your-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_APP_ID=your-app-id
```

⚠️ **Note:** Firebase requires model/controller refactoring (complex change)

---

## Option 3: Supabase (Modern PostgreSQL)

Supabase is PostgreSQL in the cloud, free tier.

### Steps:
1. Go to: https://supabase.com
2. Sign in and create new project
3. Use Supabase client SQL to create tables
4. Use Supabase JavaScript client

⚠️ **Note:** Requires rewriting all models

---

## My Recommendation:

✅ **Use MongoDB Atlas** (Option 1)
- Zero code changes
- Free forever for small projects
- Works exactly like local MongoDB
- Just change one environment variable

👉 **Choose Option 1? I'll help you set it up!**
