import React, { useState } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle2, File } from 'lucide-react';

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setError(null);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/files/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUploadSuccess(response.data.file); // Assuming backend returns { file: "<url>" }
        } catch (err) {
            setError(err.response?.data?.error || "Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto p-10 rounded-3xl glass flex flex-col items-center gap-8 transition-all duration-500 transform hover:scale-[1.01] hover:shadow-[0_8px_40px_-12px_rgba(20,184,166,0.3)] relative overflow-hidden group">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"></div>

            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex flex-col items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <UploadCloud className="w-12 h-12 text-teal-400 mb-1" strokeWidth={1.5} />
            </div>

            <div className="text-center z-10">
                <h2 className="text-3xl font-bold mb-3 tracking-tight text-white/90">Upload your file</h2>
            </div>

            <div className="w-full relative z-10 mt-2">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 ${file ? 'border-teal-400/50 bg-teal-400/10 shadow-[0_0_20px_rgba(20,184,166,0.15)]' : 'border-gray-600/50 group-hover:border-teal-400/50 hover:bg-white/5'
                    }`}>
                    {file ? (
                        <>
                            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center mb-2">
                                <File className="w-6 h-6 text-teal-400" />
                            </div>
                            <span className="text-teal-100 text-lg font-medium truncate w-full text-center px-4">{file.name}</span>
                            <div className="flex items-center gap-2 text-teal-400 text-sm font-semibold tracking-wide">
                                <CheckCircle2 className="w-4 h-4" /> Ready to upload
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:bg-teal-500/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-teal-400 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" x2="12" y1="3" y2="15"></line></svg>
                            </div>
                            <span className="text-gray-300 font-semibold text-lg">Click or Drag file here</span>
                            <span className="text-gray-500 text-sm">Any file type supported</span>
                        </>
                    )}
                </div>
            </div>

            {error && <div className="w-full p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium flex items-center justify-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" x2="12" y1="8" y2="12"></line><line x1="12" x2="12.01" y1="16" y2="16"></line></svg>{error}</div>}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full py-4 px-8 mt-2 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-400 hover:to-blue-500 font-bold text-lg text-white shadow-[0_4px_20px_rgba(20,184,166,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(20,184,166,0.6)] active:translate-y-0 active:shadow-md z-10 flex items-center justify-center"
            >
                {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Uploading...
                    </span>
                ) : 'Upload File'}
            </button>
        </div>
    );
};

export default UploadForm;
