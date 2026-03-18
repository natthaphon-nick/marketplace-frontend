'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    const [orderNumber, setOrderNumber] = useState('');

    useEffect(() => {
        // Generate a random mock order number for display
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        setOrderNumber(`ORD-${randomNum}`);
    }, []);

    return (
        <main className="bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/20 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-lg w-full bg-white/[0.02] border border-white/10 p-12 rounded-[2rem] text-center shadow-2xl backdrop-blur-md">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(236,72,153,0.3)] animate-bounce-slow">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Confirmed</h1>
                <p className="text-gray-400 mb-2">Thank you for your purchase.</p>
                <p className="text-gray-400 mb-8">Your order <span className="text-white font-bold">{orderNumber}</span> is currently being processed and will be shipped shortly.</p>

                <div className="space-y-4">
                    <Link href="/profile" className="block w-full py-4 rounded-xl font-black uppercase tracking-widest border border-white/20 hover:bg-white/5 transition-colors">
                        View Order Status
                    </Link>
                    <Link href="/" className="block w-full py-4 rounded-xl font-black uppercase tracking-widest bg-white text-black hover:bg-gray-200 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}
