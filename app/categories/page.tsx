'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { getCategories } from '@/services/api';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories({ pageSize: 100 }); // Get all for listing
                setCategories(result.data);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-32 pb-24">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-pink-500 via-violet-500 to-orange-500 bg-clip-text text-transparent">
                        Explore Categories
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Discover our curated collections of premium digital products.
                        Meticulously organized to help you find exactly what you need.
                    </p>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="aspect-[4/3] bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat: any) => (
                            <Link
                                key={cat.id}
                                href={`/categories/${cat.id}`}
                                className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 hover:border-pink-500/50 transition-all duration-500 bg-[#0a0a0a]"
                            >
                                <div className="absolute inset-0">
                                    {cat.imageUrl ? (
                                        <img
                                            src={cat.imageUrl}
                                            alt={cat.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-violet-900/20 to-pink-900/20 flex items-center justify-center">
                                            <span className="text-white/10 text-6xl font-black">{cat.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">{cat.name}</h3>
                                    <div className="flex items-center gap-2 text-pink-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        Browse Collection
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
