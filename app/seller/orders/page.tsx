'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getStoreOrders, updateOrderStatus } from '@/services/api';

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [shippingDetails, setShippingDetails] = useState<{ [key: string]: { courier: string, trackingNumber: string } }>({});

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getStoreOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch store orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, status: string) => {
        // If we switch to SHIPPING, we just update the dropdown state locally without calling API yet.
        // It will wait for the user to enter tracking info and click Confirm.
        setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));

        if (status !== 'SHIPPING') {
            try {
                await updateOrderStatus(orderId, status);
            } catch (error) {
                alert('Failed to update order status');
                fetchOrders(); // Revert
            }
        }
    };

    const handleConfirmShipping = async (orderId: string) => {
        const details = shippingDetails[orderId];
        if (!details?.courier || !details?.trackingNumber) {
            alert('Please select a courier and enter a tracking number.');
            return;
        }

        try {
            await updateOrderStatus(orderId, 'SHIPPING', details.courier, details.trackingNumber);
            alert('Shipping updated successfully!');
            fetchOrders();
        } catch (error) {
            alert('Failed to confirm shipping');
        }
    };

    const updateShippingDetail = (orderId: string, field: 'courier' | 'trackingNumber', value: string) => {
        setShippingDetails(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [field]: value
            }
        }));
    };

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

            <main className="max-w-7xl mx-auto px-4 pt-24">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Store Orders</h1>
                        <p className="text-gray-400 text-lg">Manage your customer orders and shipments.</p>
                    </div>
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                        <h3 className="text-xl font-bold mb-2">No orders yet</h3>
                        <p className="text-gray-500">When customers buy your products, orders will appear here.</p>
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

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">Order Total</div>
                                            <div className="text-xl font-bold text-pink-500">${order.total.toFixed(2)}</div>
                                        </div>
                                        <div className="h-10 w-px bg-white/10 hidden md:block"></div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Update Status</label>
                                            <select
                                                className="border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            >
                                                <option className='bg-black' value="PENDING">PENDING</option>
                                                <option className='bg-black' value="PAID">PAID</option>
                                                <option className='bg-black' value="SHIPPING">SHIPPING</option>
                                                <option className='bg-black' value="COMPLETED">COMPLETED</option>
                                                <option className='bg-black' value="CANCELLED">CANCELLED</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {order.status === 'SHIPPING' && (!order.trackingNumber) && (
                                    <div className="mb-6 bg-pink-500/5 border border-pink-500/20 rounded-xl p-6">
                                        <h4 className="text-sm font-bold text-pink-500 mb-4 uppercase tracking-wide">Enter Shipping Details</h4>
                                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-400 mb-1">Courier Service</label>
                                                <select
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
                                                    value={shippingDetails[order.id]?.courier || ''}
                                                    onChange={(e) => updateShippingDetail(order.id, 'courier', e.target.value)}
                                                >
                                                    <option className="bg-black" value="">Select Courier...</option>
                                                    <option className="bg-black" value="Kerry Express">Kerry Express</option>
                                                    <option className="bg-black" value="Flash Express">Flash Express</option>
                                                    <option className="bg-black" value="J&T Express">J&T Express</option>
                                                    <option className="bg-black" value="Thailand Post (EMS)">Thailand Post (EMS)</option>
                                                    <option className="bg-black" value="Shopee Express">Shopee Express</option>
                                                    <option className="bg-black" value="Ninja Van">Ninja Van</option>
                                                </select>
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. TH1234567890"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500"
                                                    value={shippingDetails[order.id]?.trackingNumber || ''}
                                                    onChange={(e) => updateShippingDetail(order.id, 'trackingNumber', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleConfirmShipping(order.id)}
                                                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                                            >
                                                Confirm Shipping
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {order.trackingNumber && order.trackingCourier && (
                                    <div className="mb-6 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row gap-6 justify-between items-center">
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Tracking Info</div>
                                            <div className="font-medium text-white text-lg">
                                                {order.trackingCourier} <span className="text-pink-500 font-mono">{order.trackingNumber}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Customer Details</h4>
                                    <div className="bg-white/5 rounded-xl p-4 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-gray-500 w-16">Name:</span>
                                            <span className="font-medium text-white">{order.buyer.firstName} {order.buyer.lastName}</span>
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-gray-500 w-16">Email:</span>
                                            <span className="text-gray-300">{order.buyer.email}</span>
                                        </div>
                                        {order.buyer.addresses?.[0] ? (
                                            <>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-gray-500 w-16">Address:</span>
                                                    <span className="text-gray-300">{order.buyer.addresses[0].address}</span>
                                                </div>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-gray-500 w-16">Phone:</span>
                                                    <span className="text-gray-300">{order.buyer.addresses[0].phone}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-gray-500 w-16">Address:</span>
                                                <span className="text-yellow-500 text-xs italic">No default address set</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Order Items</h4>
                                    <div className="space-y-3">
                                        {order.items.map((item: any) => (
                                            <div key={item.id} className="flex items-center gap-4 bg-white/5 rounded-xl p-3">
                                                <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                                                    {/* If product had an image we'd show it here. Assuming no direct image on item currently */}
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px]">

                                                        {item.product.images?.length ? (
                                                            <>
                                                                {item.product.images[0].imageUrl ?
                                                                    <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                    : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>
                                                                }
                                                            </>
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>
                                                        )}

                                                    </div>


                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-bold text-white truncate">{item.product.name}</div>
                                                    <div className="text-xs text-gray-400">
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
