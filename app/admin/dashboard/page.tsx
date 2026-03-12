'use client';

import React, { useState, useEffect } from 'react';
import { getActionLogStats } from '@/services/api';
import Navbar from '@/components/Navbar';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getActionLogStats();
                if (data.error) throw new Error(data.message);
                setStats(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch dashboard statistics.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] text-white">
                <Navbar />
                <div className="flex items-center justify-center h-[calc(100vh-80px)]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] text-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400 text-lg">Real-time overview of marketplace activity.</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                        <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">Total Actions</p>
                        <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                            {stats.totalActions.toLocaleString()}
                        </h3>
                    </div>
                    {stats.methodStats.map((ms: any) => (
                        <div key={ms.method} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
                            <p className="text-gray-400 text-sm font-medium mb-2 uppercase tracking-wider">{ms.method} Requests</p>
                            <h3 className="text-4xl font-bold text-white">
                                {ms._count._all.toLocaleString()}
                            </h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Today's Sales */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Today's Sales
                        </h2>
                        <div className="space-y-4">
                            {stats.todaySales.map((sale: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-gray-300 font-medium truncate max-w-[200px]">{sale.name || 'Unknown Product'}</span>
                                    <span className="text-green-400 font-bold">{sale.quantity} units</span>
                                </div>
                            ))}
                            {stats.todaySales.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No sales recorded today yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Best Sellers All Time */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                            Best Sellers (All Time)
                        </h2>
                        <div className="space-y-4">
                            {stats.bestSellers.map((sale: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-500">#{index + 1}</span>
                                        <span className="text-gray-300 font-medium truncate max-w-[200px]">{sale.name || 'Unknown Product'}</span>
                                    </div>
                                    <span className="text-yellow-500 font-bold">{sale.quantity} units</span>
                                </div>
                            ))}
                            {stats.bestSellers.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No historical sales data available.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Activity List */}
                    <div className="lg:col-span-2 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Recent Daily Activity</h2>
                        <div className="space-y-4">
                            {stats.dailyActivity.map((day: any) => (
                                <div key={day.date} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <span className="text-gray-300 font-medium">{day.date}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-32 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-pink-500 to-violet-600"
                                                style={{ width: `${Math.min(100, (day.count / stats.totalActions) * 500)}%` }}
                                            />
                                        </div>
                                        <span className="text-white font-bold">{day.count} actions</span>
                                    </div>
                                </div>
                            ))}
                            {stats.dailyActivity.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No activity recorded in the last 7 days.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Users */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <h2 className="text-2xl font-bold text-white mb-6">Top Active Users</h2>
                        <div className="space-y-6">
                            {stats.topUsers.map((user: any, index: number) => (
                                <div key={user.userId} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-pink-500 border border-pink-500/20">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium truncate">{user.name}</p>
                                        <p className="text-gray-500 text-xs">{user.count} actions recorded</p>
                                    </div>
                                </div>
                            ))}
                            {stats.topUsers.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No user activity yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
