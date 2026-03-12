'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/services/api';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setMessage('Invalid or missing reset token.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        setLoading(true);
        setMessage('');
        setSuccess(false);

        try {
            const response = await resetPassword(token, newPassword);
            if (response.message === 'Password reset successful') {
                setSuccess(true);
                setMessage('Password reset successful! You can now login with your new password.');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 3000);
            } else {
                setMessage(response.message || 'Failed to reset password.');
            }
        } catch (error) {
            setMessage('Invalid or expired token. Please request a new link.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative font-sans">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Invalid Link</h1>
                    <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password" title="Request a new link" className="text-pink-500 hover:underline">
                        Request a new link
                    </Link>
                </div>
            </div>
        );
    }

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
                        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
                        <p className="text-gray-400 text-sm">Create a new password for your account.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="confirm-password">
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                placeholder="••••••••"
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
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
