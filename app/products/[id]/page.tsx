'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getProduct, addToCart } from '@/services/api';
import Link from 'next/link';

interface ProductImage {
    id: string;
    imageUrl: string;
}

interface ProductVariant {
    id: string;
    name: string;
    stock: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    stock: number;
    category: { name: string };
    images: ProductImage[];
    store: { name: string };
    variants: ProductVariant[];
}

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await getProduct(id as string);
                setProduct(data);
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariantId(data.variants[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        if (product.variants.length > 0 && !selectedVariantId) {
            alert('Please select a variation');
            return;
        }

        setAdding(true);
        try {
            await addToCart(product.id, quantity, selectedVariantId || undefined);
            alert('Added to cart!');
        } catch (error) {
            alert('Failed to add to cart. Please login first.');
        } finally {
            setAdding(false);
        }
    };

    const selectedVariant = product?.variants.find(v => v.id === selectedVariantId);
    const effectiveStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;

    if (loading) return (
        <div className="bg-[#050505] min-h-screen text-white flex items-center justify-center">
            <div className="animate-pulse text-2xl font-black uppercase tracking-widest text-pink-500">Loading Product...</div>
        </div>
    );

    if (!product) return (
        <div className="bg-[#050505] min-h-screen text-white flex flex-col items-center justify-center">
            <h1 className="text-4xl font-black mb-8">PRODUCT NOT FOUND</h1>
            <Link href="/" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-all">BACK TO SHOP</Link>
        </div>
    );

    return (
        <main className="bg-[#050505] min-h-screen text-white">
            <Navbar />

            <section className="max-w-7xl mx-auto py-24 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* LEFT: Image Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 relative group">
                            {product.images.length > 0 ? (
                                <img
                                    src={product.images[selectedImage].imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-8xl opacity-10 font-black">{product.name.charAt(0)}</div>
                            )}
                            <div className="absolute top-6 left-6">
                                <span className="bg-pink-500/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {product.category?.name}
                                </span>
                            </div>
                        </div>

                        {product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? 'border-pink-500 scale-95' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                                    >
                                        <img src={img.imageUrl} className="w-full h-full object-cover" alt="thumbnail" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-10">
                            <Link href="/" className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">← Back to Collections</Link>
                            <h1 className="text-6xl font-black mt-6 uppercase tracking-tighter leading-none">{product.name}</h1>
                            <p className="text-pink-500 font-bold mt-4 uppercase tracking-[0.2em] text-sm">Product of {product.store?.name}</p>
                        </div>

                        <div className="text-4xl font-black text-white mb-8">
                            ${product.price.toLocaleString()}
                        </div>

                        {product.variants.length > 0 && (
                            <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Select Option</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => {
                                                setSelectedVariantId(v.id);
                                                setQuantity(1);
                                            }}
                                            disabled={v.stock === 0}
                                            className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 ${selectedVariantId === v.id
                                                    ? 'bg-pink-500 border-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                                                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 disabled:opacity-20 disabled:cursor-not-allowed'
                                                }`}
                                        >
                                            {v.name} {v.stock === 0 && '(Sold Out)'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="space-y-6 mb-12">
                            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Description</h3>
                                <p className="text-gray-300 leading-relaxed text-lg italic">"{product.description || 'No description available for this item.'}"</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-2 flex items-center">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-xl"
                                    >−</button>
                                    <span className="w-16 text-center text-xl font-black">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(effectiveStock, q + 1))}
                                        disabled={quantity >= effectiveStock}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-xl disabled:opacity-20 disabled:cursor-not-allowed"
                                    >+</button>
                                </div>
                                <div className={`text-xs font-bold uppercase tracking-widest ${effectiveStock === 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                    {effectiveStock > 0 ? `${effectiveStock} ${selectedVariant ? 'of this variant' : ''} available in stock` : 'Out of Stock'}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={adding || effectiveStock === 0}
                            className={`w-full transition-all py-6 rounded-3xl font-black text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${effectiveStock === 0 ? 'bg-gray-800 text-gray-400' : 'bg-white text-black hover:bg-pink-500 hover:text-white'}`}
                        >
                            {effectiveStock === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
                        </button>

                        <div className="mt-12 grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Store</div>
                                <div className="text-sm font-bold mt-1">{product.store?.name}</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Category</div>
                                <div className="text-sm font-bold mt-1">{product.category?.name}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
