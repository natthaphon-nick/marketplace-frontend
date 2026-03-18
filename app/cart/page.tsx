'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createOrder, addToCart, removeFromCart, getDefaultAddress } from '@/services/api';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface ProductImage {
    id: string;
    imageUrl: string;
}

interface CartItem {
    id: string;
    quantity: number;
    variantId?: string;
    variant?: { name: string, stock: number };
    product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        images?: ProductImage[];
    };
}

export default function CartPage() {
    const { cart, loading, refreshCart } = useCart();
    const router = useRouter();

    const handleQuantityChange = async (productId: string, delta: number, variantId?: string) => {
        try {
            await addToCart(productId, delta, variantId);
            refreshCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleRemove = async (itemId: string) => {
        try {
            await removeFromCart(itemId);
            refreshCart();
        } catch (error) {
            console.error('Failed to remove item:', error);
        }
    };

    const handleCheckout = async () => {
        try {
            // Check if user has a default shipping address
            const defaultAddress = await getDefaultAddress();
            if (!defaultAddress) {
                alert('กรุณาตั้งค่าที่อยู่หลักก่อนทำการสั่งซื้อ\n\n(Please set a default shipping address before placing your order)');
                router.push('/profile');
                return;
            }

            // Redirect to dedicated checkout flow
            router.push('/checkout');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        }
    };

    const total = cart?.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;

    return (
        <main className="bg-[#050505] min-h-screen text-white">
            <Navbar />

            <section className="max-w-4xl mx-auto py-24 px-6">
                <h1 className="text-5xl font-black mb-12 uppercase tracking-tighter">Your Bag</h1>

                {loading ? (
                    <p className="animate-pulse text-gray-500">Loading your cart...</p>
                ) : cart?.items.length ? (
                    <div className="space-y-8">
                        {cart.items.map((item) => (
                            <div key={item.id} className="group relative flex gap-8 items-center bg-white/[0.02] border border-white/5 p-6 rounded-3xl hover:bg-white/[0.04] transition-all">
                                <Link href={`/products/${item.product.id}`} className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                    {item.product.images?.length ? (
                                        <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>
                                    )}
                                </Link>

                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link href={`/products/${item.product.id}`} className="text-2xl font-black uppercase tracking-tight group-hover:text-pink-500 transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <div className="flex gap-2 items-center mt-1">
                                                {item.variant && (
                                                    <span className="bg-pink-500/10 text-pink-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-pink-500/20">
                                                        {item.variant.name}
                                                    </span>
                                                )}
                                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Free Shipping</p>
                                            </div>
                                        </div>
                                        <div className="text-2xl font-black text-white">$ {(item.product.price * item.quantity).toFixed(2)}</div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center bg-black rounded-xl border border-white/10 p-1">
                                            <button
                                                onClick={() => item.quantity > 1 ? handleQuantityChange(item.product.id, -1, item.variantId) : handleRemove(item.id)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                            >
                                                {item.quantity > 1 ? '−' : '✕'}
                                            </button>
                                            <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item.product.id, 1, item.variantId)}
                                                disabled={item.quantity >= (item.variant?.stock ?? item.product.stock)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-10 disabled:cursor-not-allowed"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            {item.quantity >= (item.variant?.stock ?? item.product.stock) && (
                                                <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest animate-pulse">Max Stock reached</span>
                                            )}
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                Remove Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 flex flex-col items-end">
                            <div className="flex justify-between w-full max-w-xs mb-8">
                                <span className="text-gray-500 uppercase tracking-widest font-bold">Total</span>
                                <span className="text-3xl font-black">${total}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full max-w-sm bg-pink-500 hover:bg-pink-600 text-white font-black py-6 rounded-2xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                        <p className="text-gray-500 text-xl mb-8">Your bag is as empty as deep space.</p>
                        <Link href="/" className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-pink-500 hover:text-white transition-colors">
                            START SHOPPING
                        </Link>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
