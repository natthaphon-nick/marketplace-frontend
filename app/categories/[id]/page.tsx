'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { getCategories } from '@/services/api';

export default function CategoryDetailPage() {
    const { id } = useParams();
    const [category, setCategory] = useState<any>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                // We'll fetch the single category to get its name for the header
                const result = await getCategories({ pageSize: 100 });
                const found = result.data.find((c: any) => c.id === id);
                setCategory(found);
            } catch (error) {
                console.error('Failed to fetch category details:', error);
            }
        };
        if (id) fetchCategory();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />

            <main className="pt-32">
                <div className="max-w-7xl mx-auto px-6 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Collection</span>
                            <h1 className="text-5xl md:text-7xl font-black text-white mt-4 uppercase">
                                {category?.name || 'Loading...'}
                            </h1>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Browse our exclusive selection of digital assets and premium products in the {category?.name} category.
                        </p>
                    </div>
                </div>

                {/* Filtered Product Grid */}
                <ProductGrid categoryId={id as string} />
            </main>

            <Footer />
        </div>
    );
}
