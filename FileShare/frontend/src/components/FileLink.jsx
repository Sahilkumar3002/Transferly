import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

const FileLink = ({ downloadUrl }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(downloadUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-lg mx-auto p-10 rounded-3xl glass flex flex-col items-center gap-8 animate-in fade-in zoom-in-95 duration-500 shadow-[0_8px_40px_-12px_rgba(34,197,94,0.3)] relative overflow-hidden group">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-3xl"></div>

            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500 relative">
                <div className="absolute inset-0 rounded-2xl bg-green-400/20 animate-ping opacity-20"></div>
                <Check className="w-12 h-12 text-green-400" strokeWidth={3} />
            </div>

            <div className="text-center w-full z-10">
                <h2 className="text-3xl font-bold mb-3 tracking-tight text-white/90">Upload Successful!</h2>
                <p className="text-gray-400 text-base mb-8 max-w-sm mx-auto">Your file is ready to be shared. The secure link below will expire in <span className="text-white font-medium">24 hours</span>.</p>

                <div className="flex flex-col gap-3 w-full">
                    <label className="text-sm font-semibold text-gray-400 tracking-wide uppercase text-left ml-2">Shareable Link</label>
                    <div className="flex items-center gap-2 p-2 pl-4 rounded-2xl bg-black/40 border border-white/10 w-full mb-6 relative group transition-all duration-300 hover:border-green-400/30 hover:bg-black/60 focus-within:border-green-400 focus-within:ring-4 focus-within:ring-green-400/20">
                        <input
                            type="text"
                            readOnly
                            value={downloadUrl}
                            className="bg-transparent flex-1 text-base text-gray-200 outline-none truncate font-medium selection:bg-green-500/30 py-2"
                        />
                        <button
                            onClick={handleCopy}
                            className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-semibold ${copied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                            title="Copy URL"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    <span>Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    <span className="hidden sm:inline">Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold text-lg transition-colors group"
                >
                    Open Link <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
            </div>
        </div>
    );
};

export default FileLink;
