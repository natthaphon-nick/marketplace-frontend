'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSuccess(false);

        try {
            const response = await forgotPassword(email);
            setSuccess(true);
            setMessage(response.message || 'If your email is in our system, you will receive a reset link.');
        } catch (error) {
            setMessage('Unable to connect to the server. Make sure the API is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-md z-10">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-block mb-6">
                            <span className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                                MarketPlace
                            </span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                        <p className="text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                placeholder="Enter your email"
                            />
                        </div>

                        {message && (
                            <div className={`text-sm text-center p-4 rounded-xl border ${success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-all active:scale-[0.98] ${(loading || success) ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending link...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <Link href="/login" className="text-gray-400 text-sm hover:text-white transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
