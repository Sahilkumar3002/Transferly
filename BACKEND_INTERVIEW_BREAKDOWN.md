# 🗣️ Backend Interview Cheat Sheet: File Sharing API

*Use this as a quick-reference guide during interviews. It's written in plain, simple English so you can easily explain how your project works without sounding like a robot.*

---

**✅ Project Status:** *100% Complete. The backend architecture, full MERN stack integration, and the new MongoDB GridFS streaming features are fully built, tested, and live in production.*

---
**When they ask:** *"Tell me about a recent project you built."*

> **What to say:**
> "I built Transferly, a full-stack file sharing app similar to WeTransfer. I designed the architecture using the MERN stack: React for the frontend, Node and Express for the backend, and MongoDB for the database. 
> 
> Rather than paying for a cloud storage service like AWS, I figured out how to stream the files directly into my MongoDB database using a feature called GridFS. Because I used data streams and memory buffers in my Node server, users can upload huge files without the server ever crashing or running out of memory. 
> 
> Finally, I deployed the frontend to Vercel and the backend to a persistent server on Render."

---

## 2. ⚙️ How It Works (Step-by-Step)
**When they ask:** *"Walk me through the upload process."*

**What to say:**
1. **The Upload:** The user selects a file in React. The frontend sends it to my Node.js backend.
2. **The Buffer:** My backend uses a tool called `Multer`. Instead of saving the file to the server's hard drive, it temporarily holds it in the server's RAM (memory) as a "Buffer".
3. **The Stream:** I turn that memory Buffer into a "Stream". Think of a stream like a hose—instead of moving the whole file at once, it flows continuously.
4. **MongoDB GridFS:** I point that hose into MongoDB GridFS. GridFS automatically chops the file into tiny 255KB pieces and saves them inside the database.
5. **The Download:** When someone clicks the download link, my server does the reverse. It grabs those chunks from the database and streams them straight back to the user's browser.

---

## 3. 🚧 Challenges Faced (STAR Method)
**When they ask:** *"Tell me about a technical challenge you solved."*

*(Pick one of these to talk about)*

### Challenge 1: Moving from Vercel to Render
* **The Problem:** At first, I hosted my backend on Vercel. But Vercel limits uploads to just 4.5MB. If I tried uploading a big file, the server instantly rejected it.
* **The Solution:** I learned that Vercel is just for "serverless" functions, not real persistent servers. I migrated my entire backend over to Render.com, which runs a true Node.js server.
* **The Result:** The 4.5MB limit was gone, and I could finally upload massive files. 

### Challenge 2: The "Crash Loop" Bug
* **The Problem:** After moving to Render, my backend kept crashing immediately on startup, showing a "Network Error" on the frontend.
* **The Solution:** I changed my Node code so that instead of fully crashing when the database connection failed, it would stay alive just long enough to print an error log. I checked the logs and realized my MongoDB Atlas database was blocking Render's IP address.
* **The Result:** I went into MongoDB Atlas and allowed access from anywhere (`0.0.0.0/0`). The crash loop stopped, and the app worked perfectly.

### Challenge 3: Auto-Deleting Old Files
* **The Problem:** If I didn't delete files, my database would fill up forever and cost money. But running a constant "CRON job" on the server to check for old files is heavy and complicated.
* **The Solution:** I used a built-in MongoDB feature called a "TTL Index" (Time-To-Live). I just added `expires: 86400` to my Mongoose code.
* **The Result:** MongoDB automatically deletes the files exactly 24 hours after they are uploaded. I don't have to write any manual cleanup code.

---

## 4. 🚀 Future Improvements
**When they ask:** *"What would you add if you had more time?"*

**What to say:**
* **AWS S3:** "GridFS is great, but if this app went viral, my MongoDB storage would fill up fast. I'd move the storage to AWS S3, which is cheaper and built exactly for massive file holding."
* **Redis Caching:** "I'd use Redis to cache the download links. That way, if a file gets downloaded 1000 times, my database isn't queried 1000 times."
* **Email Feature:** "I'd add a background job queue using `BullMQ` so users could email the download link straight from the app without slowing down the webpage."

---

## 5. 🛠️ Tech Stack Keywords
* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js, Multer
* **Database:** MongoDB Atlas, Mongoose
* **Core Concepts Used:** Streams, Buffers, TTL Indexes, CORS, GridFS
* **Deployment:** Vercel (Frontend), Render (Backend)
