import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage';

function App() {
    return (
        <Router>
            <div className="min-h-screen text-white flex flex-col pt-20 relative font-sans">
                <header className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/5 py-4 px-8 z-50 flex justify-center items-center shadow-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight">
                            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Transferly</span>
                            <span className="text-white/90 font-light ml-2">Drop</span>
                        </h1>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto relative z-10">
                    <Routes>
                        <Route path="/" element={<UploadPage />} />
                        <Route path="/file/:uuid" element={<DownloadPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
