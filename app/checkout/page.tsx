'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getDefaultAddress, createOrder } from '@/services/api';
import Link from 'next/link';

export default function CheckoutPage() {
    const { cart, loading, refreshCart } = useCart();
    const router = useRouter();
    const [address, setAddress] = useState<any>(null);
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const defaultAddr = await getDefaultAddress();
                if (!defaultAddr) {
                    router.push('/profile'); // Enforced address requirement
                } else {
                    setAddress(defaultAddr);
                }
            } catch (err) {
                router.push('/profile');
            }
        };
        fetchAddress();
    }, [router]);

    const total = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

    const handleConfirmOrder = async () => {
        setSubmitting(true);
        try {
            await createOrder();
            refreshCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
            setSubmitting(false);
        }
    };

    if (loading || !address) {
        return (
            <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center">
                <p className="animate-pulse text-xl">Preparing your checkout...</p>
            </div>
        );
    }

    if (!cart?.items.length) {
        return (
            <div className="bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">Your Bag is Empty</h1>
                <p className="text-gray-400 mb-8 max-w-md">You need items in your bag to proceed to checkout.</p>
                <Link href="/" className="bg-pink-500 text-white font-bold px-10 py-4 rounded-xl hover:bg-pink-600 transition-colors uppercase tracking-widest">
                    Return to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="bg-[#050505] min-h-screen text-white flex flex-col items-center py-12 px-6">
            <Link href="/" className="text-3xl font-black tracking-tighter mb-12 uppercase hover:text-pink-500 transition-colors">
                Marketplace.<span className="text-pink-500">Checkout</span>
            </Link>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Checkout Steps */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Step 1: Address */}
                    <div className={`p-8 rounded-3xl border transition-all duration-300 ${step === 1 ? 'bg-white/[0.03] border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'bg-transparent border-white/10 opacity-70'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 1 ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-500'}`}>1</span>
                                Shipping Address
                            </h2>
                            {step > 1 && (
                                <button onClick={() => setStep(1)} className="text-sm font-bold text-pink-500 hover:text-pink-400 transition-colors uppercase tracking-widest">Edit</button>
                            )}
                        </div>
                        
                        {step === 1 ? (
                            <div className="space-y-6">
                                <div className="p-4 rounded-2xl border border-pink-500/30 bg-pink-500/5 cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold">{address.fullName}</span>
                                        <span className="text-xs font-black uppercase tracking-widest bg-pink-500/20 text-pink-500 px-2 py-1 rounded-full">Default</span>
                                    </div>
                                    <p className="text-sm text-gray-400">{address.addressLine1}</p>
                                    <p className="text-sm text-gray-400">{address.city}, {address.province} {address.postalCode}</p>
                                    <p className="text-sm text-gray-400 mt-2">{address.phoneNumber}</p>
                                </div>
                                <button onClick={() => setStep(2)} className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors mt-6">
                                    Continue to Delivery
                                </button>
                            </div>
                        ) : (
                            <div className="px-12 text-gray-400 text-sm">
                                {address.addressLine1}, {address.city}
                            </div>
                        )}
                    </div>

                    {/* Step 2: Delivery Method */}
                    <div className={`p-8 rounded-3xl border transition-all duration-300 ${step === 2 ? 'bg-white/[0.03] border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'bg-transparent border-white/10 opacity-70'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-500'}`}>2</span>
                                Delivery Method
                            </h2>
                            {step > 2 && (
                                <button onClick={() => setStep(2)} className="text-sm font-bold text-pink-500 hover:text-pink-400 transition-colors uppercase tracking-widest">Edit</button>
                            )}
                        </div>
                        
                        {step === 2 ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl border border-pink-500/30 bg-pink-500/5 flex items-center justify-between cursor-pointer">
                                    <div>
                                        <div className="font-bold">Premium Standard Shipping</div>
                                        <div className="text-sm text-gray-400">3-5 Business Days</div>
                                    </div>
                                    <div className="font-black">FREE</div>
                                </div>
                                <button onClick={() => setStep(3)} className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors mt-6">
                                    Continue to Payment
                                </button>
                            </div>
                        ) : step > 2 ? (
                            <div className="px-12 text-gray-400 text-sm flex justify-between">
                                <span>Premium Standard Shipping</span>
                                <span>FREE</span>
                            </div>
                        ) : null}
                    </div>

                    {/* Step 3: Payment */}
                    <div className={`p-8 rounded-3xl border transition-all duration-300 ${step === 3 ? 'bg-white/[0.03] border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'bg-transparent border-white/10 opacity-70'}`}>
                        <div className="flex items-center mb-6">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 3 ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-500'}`}>3</span>
                                Payment
                            </h2>
                        </div>
                        
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => setPaymentMethod('credit_card')}
                                        className={`p-4 rounded-2xl border ${paymentMethod === 'credit_card' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5 disabled:opacity-50'} transition-all flex flex-col items-center justify-center gap-2`}
                                    >
                                        <span className="text-2xl">💳</span>
                                        <span className="font-bold text-sm tracking-wide">Credit Card</span>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('promptpay')}
                                        className={`p-4 rounded-2xl border ${paymentMethod === 'promptpay' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-white/5'} transition-all flex flex-col items-center justify-center gap-2`}
                                    >
                                        <span className="text-2xl">📱</span>
                                        <span className="font-bold text-sm tracking-wide">PromptPay</span>
                                    </button>
                                </div>

                                {paymentMethod === 'credit_card' && (
                                    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <input type="text" placeholder="Cardholder Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                                        <input type="text" placeholder="Card Number" maxLength={19} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" placeholder="MM/YY" maxLength={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                                            <input type="text" placeholder="CVC" maxLength={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500" />
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'promptpay' && (
                                    <div className="flex flex-col items-center justify-center p-8 border border-white/10 rounded-2xl bg-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center mb-4">
                                            <span className="text-black/20 text-sm font-black text-center">(Mock QR Code)</span>
                                        </div>
                                        <p className="text-sm text-gray-400 text-center">Scan with any banking app.<br />Confirm payment below to proceed.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-[#111] p-8 rounded-3xl border border-white/10 sticky top-8">
                        <h3 className="text-xl font-black uppercase tracking-tight mb-8">Order Summary</h3>
                        
                        <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {cart.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/5 relative">
                                        <div className="absolute top-0 right-0 w-5 h-5 bg-white/10 backdrop-blur-md rounded-bl-lg flex items-center justify-center text-[10px] font-bold border-b border-l border-white/5 z-10">
                                            {item.quantity}
                                        </div>
                                        {item.product.images?.length ? (
                                            <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl opacity-20">📦</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <div className="font-bold text-sm line-clamp-2 leading-tight">{item.product.name}</div>
                                        {item.variant && (
                                            <div className="text-xs text-gray-500 mt-1">{item.variant.name}</div>
                                        )}
                                        <div className="font-black mt-1">${(item.product.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-white/10 pt-6 space-y-4">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax</span>
                                <span>Included</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-white/10 pt-6">
                                <span className="font-black uppercase tracking-widest">Total</span>
                                <span className="text-3xl font-black text-pink-500">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleConfirmOrder}
                            disabled={step !== 3 || submitting}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest mt-8 transition-all duration-300 ${step === 3 && !submitting ? 'bg-gradient-to-r from-pink-600 to-violet-600 hover:scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.3)]' : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'}`}
                        >
                            {submitting ? 'Processing...' : 'Confirm & Pay'}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
