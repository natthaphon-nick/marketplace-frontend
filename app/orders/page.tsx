'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getMyOrders } from '@/services/api';
import Link from 'next/link';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch my orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            case 'PAID': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'SHIPPING': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
            case 'COMPLETED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'CANCELLED': return 'text-red-500 bg-red-500/10 border-red-500/20';
            default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-12">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 pt-24">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2">My Orders</h1>
                    <p className="text-gray-400 text-lg">Track your purchases and view order history.</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl h-32 animate-pulse" />
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-20 bg-[#0a0a0a] border border-white/10 rounded-3xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-600 mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <h3 className="text-xl font-bold mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
                        <Link href="/" className="inline-block px-6 py-3 bg-pink-600 hover:bg-pink-500 rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(219,39,119,0.3)]">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order.id} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-sm text-gray-400">#{order.id.slice(0, 8)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">Order Total</div>
                                            <div className="text-xl font-bold text-pink-500">${order.total.toFixed(2)}</div>
                                        </div>
                                    </div>

                                    {order.trackingNumber && order.trackingCourier && (
                                        <div className="mt-6 mb-6 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6 justify-between items-center">
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Shipping Details</div>
                                                <div className="font-medium text-white text-lg">
                                                    {order.trackingCourier} <span className="text-pink-500 font-mono">{order.trackingNumber}</span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                Shipped on: {new Date(order.shippedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                    <div className="space-y-3">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3">
                                                <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product.images?.length > 0 ? (
                                                        <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">Img</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-white truncate">{item.product.name}</div>
                                                    <div className="text-sm text-gray-400">
                                                        {item.variantName ? `Variant: ${item.variantName}` : 'Standard'} • Qty: {item.quantity}
                                                    </div>
                                                </div>
                                                <div className="text-right font-medium">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
