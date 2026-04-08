import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import FileLink from '../components/FileLink';

const UploadPage = () => {
    const [downloadUrl, setDownloadUrl] = useState(null);

    return (
        <div className="w-full relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
            {/* Premium animated background orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-teal-500/10 rounded-full blur-[120px] -z-10 animate-pulse mix-blend-screen pointer-events-none"></div>
            <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-white tracking-tight drop-shadow-2xl">
                    Share Files <br /><span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">Securely & Instantly</span>
                </h2>
                <p className="text-lg md:text-xl text-gray-400/90 max-w-2xl mx-auto font-light leading-relaxed">
                    Lightning fast, highly secure file sharing. Upload any file and get a beautiful shareable link in seconds. No sign-up required.
                </p>
            </div>

            <div className="w-full relative z-20">
                {!downloadUrl ? (
                    <UploadForm onUploadSuccess={(url) => setDownloadUrl(url)} />
                ) : (
                    <FileLink downloadUrl={downloadUrl} />
                )}
            </div>
        </div>
    );
};

export default UploadPage;
