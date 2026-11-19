# 🚀 Transferly — Secure File Sharing

> **Lightning fast, highly secure file sharing. Upload any file and get a beautiful shareable link in seconds.**

### 🔗 [GitHub Repository](https://github.com/Sahilkumar3002/Transferly) · [Developer Profile](https://github.com/Sahilkumar3002)

---

## ✨ Features
- 🗄️ Files stored directly in **MongoDB GridFS** — zero third-party cloud storage needed
- 📡 True **streaming upload & download** — files piped in 255KB chunks, never fully loaded into RAM
- 🧠 **In-memory Buffer** used during upload for zero disk writes
- 🔗 Instant shareable download link (UUID-protected)
- ⏳ Auto-expiry after 24 hours (MongoDB TTL index)
- 📊 Real-time upload progress bar
- 🎨 Premium dark UI with glassmorphism, gradients & animations
- 📱 Fully responsive design
- 🔒 No sign-up required

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Axios |
| **Backend** | Node.js, Express, Multer (MemoryStorage) |
| **File Storage** | **MongoDB GridFS** (streaming + buffer) |
| **Database** | MongoDB Atlas + Mongoose |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

---

## 🏗️ File Upload Architecture

```text
Browser → multipart/form-data → Express (Multer MemoryStorage)
                                      ↓
                               Buffer in RAM
                                      ↓
                         Readable Stream from Buffer
                                      ↓
                      GridFS openUploadStream → MongoDB Atlas
                        (stored as 255KB chunks)
```

```text
Download Request → Backend → GridFS openDownloadStream
                                      ↓
                        Piped directly to HTTP Response
                          (streamed, no RAM spike)
```

---

## 🏗️ Project Structure
```text
FileShare/
├── backend/        # Express API — stream upload, GridFS, metadata, download
│   ├── models/     # File.js (metadata + gridfsId reference)
│   ├── routes/     # files.js (upload, download, file info)
│   └── server.js   # Entry point
└── frontend/       # React + Vite UI
    ├── src/
    │   ├── components/   # UploadForm (progress bar), FileLink
    │   └── pages/        # UploadPage, DownloadPage
    └── index.html
```

---

## 🔗 Links & Author

| Resource | URL |
|---|---|
| 📦 **Source Code** | [github.com/Sahilkumar3002/Transferly](https://github.com/Sahilkumar3002/Transferly) |
| 👤 **Developer** | [github.com/Sahilkumar3002](https://github.com/Sahilkumar3002) |

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas URI or local MongoDB

### 1. Backend
```bash
cd FileShare/backend
npm install
node server.js
```

### 2. Frontend
```bash
cd FileShare/frontend
npm install
npm run dev
```

---

## 📄 License
MIT
