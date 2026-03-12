'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getProducts, addToCart, getProductsByCategory } from '@/services/api';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    category: { name: string };
    images: { imageUrl: string }[];
    variants?: any[];
}

export default function ProductGrid({ categoryId }: { categoryId?: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = categoryId
                    ? await getProductsByCategory(categoryId)
                    : await getProducts();
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);


    const handleAddToCart = async (productId: string) => {
        try {
            await addToCart(productId, 1);
            alert('Added to cart!');
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add to cart. Please login.');
        }
    };

    if (loading) {
        return (
            <div className="bg-[#050505] py-24 px-6 text-center text-white">
                <p className="text-2xl animate-pulse">Loading products...</p>
            </div>
        );
    }

    return (
        <section id="shop" className="bg-[#050505] py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">New Arrivals</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mt-2">TRENDING NOW</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products.map((product) => {
                        const hasVariants = product.variants && product.variants.length > 0;

                        return (
                            <div key={product.id} className="group relative flex flex-col">
                                <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] bg-[#111] rounded-3xl border border-white/10 overflow-hidden mb-6 transition-all duration-500 group-hover:border-pink-500/50">
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-transparent to-violet-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Product Image */}
                                    <div className="w-full h-full flex items-center justify-center">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0].imageUrl}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-[#1a1a1a] text-8xl font-black select-none pointer-events-none">
                                                {product.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                {/* Quick Add/Select Button */}
                                {product.stock > 0 ? (
                                    hasVariants ? (
                                        <Link
                                            href={`/products/${product.id}`}
                                            className="absolute bottom-[108px] left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black font-bold py-4 rounded-xl shadow-2xl hover:bg-pink-500 hover:text-white z-10 flex items-center justify-center"
                                        >
                                            Select Options
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleAddToCart(product.id)}
                                            className="absolute bottom-[108px] left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-black font-bold py-4 rounded-xl shadow-2xl hover:bg-pink-500 hover:text-white z-10"
                                        >
                                            Add to Cart
                                        </button>
                                    )
                                ) : (
                                    <div className="absolute top-6 right-6 z-20">
                                        <span className="bg-red-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-start">
                                    <Link href={`/products/${product.id}`} className="block">
                                        <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">{product.category?.name}</span>
                                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-pink-500 transition-colors">{product.name}</h3>
                                    </Link>
                                    <div className="text-xl font-black text-white">${product.price}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {products.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No products found. Add some products in the backend!
                    </div>
                )}
            </div>
        </section >
    );
}
