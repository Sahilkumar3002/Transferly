import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FileDown, FileText, AlertCircle, Loader2 } from 'lucide-react';

const DownloadPage = () => {
    const { uuid } = useParams();
    const [fileDetails, setFileDetails] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/files/${uuid}`);
                setFileDetails(response.data);
            } catch (err) {
                setError(err.response?.data?.error || "File not found or link expired");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [uuid]);

    const handleDownload = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/files/download/${uuid}`;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-cyan-400">
                <Loader2 className="w-16 h-16 animate-spin text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                <p className="text-xl font-medium tracking-wide text-white/80 animate-pulse">Decrypting secure file...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-lg w-full mx-auto p-12 rounded-3xl glass flex flex-col items-center gap-6 text-center shadow-[0_8px_40px_-12px_rgba(239,68,68,0.3)] border border-red-500/20 relative overflow-hidden mt-10">
                <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none rounded-3xl"></div>
                <div className="w-24 h-24 rounded-2xl bg-red-500/10 flex items-center justify-center relative shadow-inner">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Access Denied</h2>
                <p className="text-gray-400 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="w-full relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
            {/* Premium animated background orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[120px] -z-10 animate-pulse mix-blend-screen pointer-events-none"></div>
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="max-w-lg w-full p-10 rounded-3xl glass flex flex-col items-center gap-8 relative overflow-hidden transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(59,130,246,0.3)] group mt-10">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none rounded-3xl"></div>

                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex flex-col items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <FileText className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
                </div>

                <div className="text-center w-full z-10 flex flex-col items-center">
                    <h2 className="text-3xl font-bold mb-2 text-white break-all max-w-full drop-shadow-md px-4" title={fileDetails.filename}>
                        {fileDetails.filename}
                    </h2>

                    <div className="flex items-center gap-3 mt-4 mb-8">
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium tracking-wide">
                            {formatSize(fileDetails.size)}
                        </span>
                        <span className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium tracking-wide">
                            {new Date(fileDetails.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <button
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 font-bold text-lg text-white shadow-[0_4px_20px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(59,130,246,0.6)] active:translate-y-0 active:shadow-md"
                    >
                        <FileDown className="w-6 h-6" />
                        Download Securely
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
            </div>
        </div>
    );
};

export default DownloadPage;
