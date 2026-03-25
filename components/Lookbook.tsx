import React from 'react';
import Link from 'next/link';

const categories = [
    {
        id: 'c98ff772-b25b-4819-a358-28d22d5c0e95',
        title: 'SNEAKERS',
        subtitle: 'Engineered for the streets.',
        image: 'https://images.unsplash.com/photo-1552346154-21d32810baa3?q=80&w=2000&auto=format&fit=crop', // Fallback Unsplash image
        color: 'from-pink-500/80 to-transparent'
    },
    {
        id: 'a648d0cf-1dd5-40d0-8657-8ee153f71846',
        title: 'OUTERWEAR',
        subtitle: 'Defy the elements.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=2000&auto=format&fit=crop',
        color: 'from-violet-600/80 to-transparent'
    },
    {
        id: '12e7b8b6-c2e0-4e7b-8769-a4d63fcfa50a',
        title: 'ACCESSORIES',
        subtitle: 'The final touch.',
        image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=2000&auto=format&fit=crop',
        color: 'from-blue-600/80 to-transparent'
    }
];

export default function Lookbook() {
    return (
        <section id="lookbook" className="py-24 bg-[#050505] border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Curated Styles</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white mt-2 tracking-tighter">THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">LOOKBOOK</span></h2>
                    </div>
                    <Link href="/categories" className="text-white font-bold uppercase tracking-widest text-sm border-b-2 border-pink-500 pb-1 hover:text-pink-500 transition-colors">
                        View All Categories
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px] lg:h-[600px]">
                    {categories.map((category, idx) => (
                        <Link
                            key={category.id}
                            href={`/categories/${category.id}`}
                            className={`group relative overflow-hidden rounded-3xl ${idx === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${category.image})` }}
                            ></div>

                            {/* Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex justify-between items-end">
                                <div>
                                    <p className="text-white/80 font-medium mb-2">{category.subtitle}</p>
                                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">{category.title}</h3>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
