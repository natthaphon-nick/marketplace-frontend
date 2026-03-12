'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { login, getProfile } from '@/services/api';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setSuccess(false);

        try {
            const response = await login(username, password);
            if (response && response.accessToken) {
                setSuccess(true);
                setMessage('Login Successful! Redirecting...');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                setMessage(response.message || 'Login failed');
            }
        } catch (error) {
            setMessage('Unable to connect to the server. Make sure the API is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
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
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Use <span className="text-pink-500">root@example.com</span> / <span className="text-pink-500">P@ssw0rd</span></p>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                placeholder="••••••••"
                            />
                            <div className="flex justify-end mt-2">
                                <Link href="/forgot-password" title="Forgot Password?" className="text-xs text-gray-400 hover:text-pink-500 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm text-center p-3 rounded-xl border ${success ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 shadow-[0_0_20px_rgba(219,39,119,0.3)] transition-all active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center mt-8 text-gray-400 text-sm">
                        {' Don\'t have an account? '}
                        <a href="/register" className="text-white font-medium hover:underline">
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
