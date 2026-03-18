'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { addToCart } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist } = useWishlist();
    const { refreshCart } = useCart();
    const router = useRouter();

    const handleMoveToCart = async (productId: string) => {
        try {
            await addToCart(productId, 1);
            refreshCart();
            removeFromWishlist(productId);
            // Optional: User might want to stay on the wishlist or go to cart
            // router.push('/cart'); 
            alert('Moved to cart!');
        } catch (error) {
            console.error('Failed to move to cart:', error);
            alert('Failed to add to cart. Please login.');
        }
    };

    return (
        <main className="bg-[#050505] min-h-screen text-white flex flex-col pt-20">
            <Navbar />

            <section className="flex-grow max-w-7xl w-full mx-auto py-16 px-6">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-12 gap-4 border-b border-white/10 pb-8">
                    <div>
                        <span className="text-pink-500 font-bold uppercase tracking-widest text-sm mb-2 block">Your Curated Selection</span>
                        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Wishlist</h1>
                    </div>
                    <span className="text-gray-400 font-bold tracking-widest uppercase">{wishlistItems.length} Items</span>
                </div>

                {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative flex flex-col bg-[#111] rounded-3xl border border-white/10 overflow-hidden hover:border-pink-500/50 transition-colors duration-500">
                                {/* Remove button */}
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white hover:bg-black transition-all"
                                    title="Remove from wishlist"
                                >
                                    ✕
                                </button>

                                <Link href={`/products/${item.id}`} className="block relative aspect-[4/5] overflow-hidden bg-black/20">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl opacity-20 bg-[#1a1a1a]">
                                            📦
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <Link href={`/products/${item.id}`} className="block">
                                            <h3 className="text-lg font-bold text-white group-hover:text-pink-500 transition-colors leading-tight">{item.name}</h3>
                                        </Link>
                                    </div>
                                    
                                    <div className="mt-auto">
                                        <div className="text-xl font-black text-white mb-4">${item.price}</div>
                                        <button
                                            onClick={() => handleMoveToCart(item.id)}
                                            className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-sm bg-white text-black hover:bg-pink-500 hover:text-white transition-colors duration-300 shadow-lg"
                                        >
                                            Move to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-3xl">
                        <div className="w-24 h-24 mb-6 text-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-full h-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 max-w-md mb-8">Save items you love here so you never lose track of them.</p>
                        <Link href="/categories" className="bg-white text-black font-black uppercase tracking-widest px-10 py-4 rounded-full hover:bg-pink-500 hover:text-white transition-colors">
                            Explore Collections
                        </Link>
                    </div>
                )}
            </section>

            <Footer />
        </main>
    );
}
