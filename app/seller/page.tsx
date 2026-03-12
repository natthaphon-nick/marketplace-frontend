'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import {
    getMyStores,
    getMasterCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    createStore,
    getProductsByStore,
    createCategory
} from '@/services/api';

interface Store {
    id: string;
    name: string;
}

interface Category {
    id: string;
    name: string;
}

interface ProductImage {
    id: string;
    imageUrl: string;
}

interface ProductVariant {
    id?: string;
    name: string;
    stock: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: string;
    category?: { name: string };
    images?: ProductImage[];
    variants?: ProductVariant[];
}

export default function SellerPage() {
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false);

    // View State
    const [selectedStore, setSelectedStore] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);

    // Form State for Create/Edit
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('10');
    const [variants, setVariants] = useState<{ name: string, stock: number }[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [imageFiles, setImageFiles] = useState<{ id?: string, preview: string }[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    // Store Creation State
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');

    // Category Creation State
    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchStoresAndCategories = async () => {
        try {
            const [storesData, categoriesData] = await Promise.all([
                getMyStores(),
                getMasterCategories()
            ]);
            setStores(storesData);
            setCategories(categoriesData);
            if (storesData.length > 0) {
                const storeId = storesData[0].id;
                setSelectedStore(storeId);
                fetchProducts(storeId);
            }
            if (categoriesData.length > 0) setSelectedCategory(categoriesData[0].id);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (storeId: string) => {
        setProductsLoading(true);
        try {
            const data = await getProductsByStore(storeId);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setProductsLoading(false);
        }
    };

    useEffect(() => {
        fetchStoresAndCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageFiles(prev => [...prev, { preview: reader.result as string }]);
            };
            reader.readAsDataURL(file);
        });
        // Reset input
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createStore({ name: newStoreName });
            setNewStoreName('');
            setShowStoreForm(false);
            fetchStoresAndCategories();
        } catch (error) {
            setMessage('Failed to create store.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;
        setSubmitting(true);
        try {
            const response = await createCategory({ name: newCategoryName });
            if (response && response.id) {
                setNewCategoryName('');
                setShowCategoryForm(false);
                const categoriesData = await getMasterCategories();
                setCategories(categoriesData);
                setSelectedCategory(response.id);
                setMessage('Category created!');
            }
        } catch (error) {
            console.error('Failed to create category:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setIsAddMode(false);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setStock(product.stock.toString());
        setVariants(product.variants?.map(v => ({ name: v.name, stock: v.stock })) || []);
        setSelectedCategory(product.categoryId);
        setImageFiles(product.images?.map(img => ({ id: img.id, preview: img.imageUrl })) || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsAddMode(true);
        setName('');
        setDescription('');
        setPrice('');
        setStock('10');
        setVariants([]);
        setImageFiles([]);
        if (categories.length > 0) setSelectedCategory(categories[0].id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        const productData = {
            name,
            description,
            price: parseFloat(price),
            stock: variants.length > 0 ? variants.reduce((acc, v) => acc + v.stock, 0) : parseInt(stock),
            storeId: selectedStore,
            categoryId: selectedCategory,
            images: imageFiles.map(img => img.preview),
            variants: variants.length > 0 ? variants : undefined
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                setMessage('Product updated successfully!');
            } else {
                await createProduct(productData);
                setMessage('Product created successfully!');
            }
            setIsAddMode(false);
            setEditingProduct(null);
            fetchProducts(selectedStore);
        } catch (error) {
            setMessage('Error saving product.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await deleteProduct(id);
            fetchProducts(selectedStore);
        } catch (error) {
            alert('Failed to delete product.');
        }
    };

    return (
        <main className="bg-[#050505] min-h-screen text-white">
            <Navbar />

            <section className="max-w-6xl mx-auto py-24 px-6">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Seller Center</span>
                        <h1 className="text-5xl font-black mt-2 uppercase tracking-tighter">Your Inventory</h1>
                    </div>
                    {stores.length > 0 && !isAddMode && !editingProduct && (
                        <div className="flex gap-4">
                            <Link
                                href="/seller/orders"
                                className="bg-pink-500/10 text-pink-500 border border-pink-500/20 font-black px-8 py-3 rounded-xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center"
                            >
                                CUSTOMER ORDERS
                            </Link>
                            <button
                                onClick={handleAddClick}
                                className="bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105"
                            >
                                + ADD NEW PRODUCT
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="animate-pulse text-gray-500 text-xl">Loading...</div>
                ) : stores.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
                        {!showStoreForm ? (
                            <>
                                <p className="text-gray-400 mb-8">You don't have a store yet.</p>
                                <button
                                    onClick={() => setShowStoreForm(true)}
                                    className="bg-white text-black font-bold px-10 py-4 rounded-full hover:bg-pink-500 hover:text-white transition-colors"
                                >
                                    CREATE STORE
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleCreateStore} className="max-w-md mx-auto space-y-6">
                                <input
                                    type="text"
                                    value={newStoreName}
                                    onChange={(e) => setNewStoreName(e.target.value)}
                                    placeholder="Store Name"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500"
                                    required
                                />
                                <button type="submit" className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl">START SELLING</button>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* LEFT: Management Form (Hidden when listing unless editing/adding) */}
                        {(isAddMode || editingProduct) && (
                            <div className="lg:col-span-5">
                                <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-6 sticky top-24">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                                        <button type="button" onClick={() => { setIsAddMode(false); setEditingProduct(null); }} className="text-gray-500 hover:text-white">✕</button>
                                    </div>

                                    {message && (
                                        <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-300 ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                            {message}
                                        </div>
                                    )}

                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6 flex items-center justify-between">
                                        <div>
                                            <label className="block text-gray-500 text-[10px] uppercase font-black tracking-widest mb-0.5">Active Store</label>
                                            <div className="text-pink-500 font-bold truncate max-w-[200px]">{stores[0]?.name}</div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 font-bold">
                                            {stores[0]?.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" placeholder="Product name" />
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Price ($)</label>
                                        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="block text-gray-500 text-xs uppercase font-bold">Variations (Optional)</label>
                                            <button
                                                type="button"
                                                onClick={() => setVariants([...variants, { name: '', stock: 10 }])}
                                                className="text-pink-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                                + ADD OPTION
                                            </button>
                                        </div>

                                        {variants.length > 0 ? (
                                            <div className="space-y-2">
                                                {variants.map((variant, index) => (
                                                    <div key={index} className="flex gap-2 animate-in slide-in-from-left-2 duration-200">
                                                        <input
                                                            type="text"
                                                            value={variant.name}
                                                            onChange={(e) => {
                                                                const v = [...variants];
                                                                v[index].name = e.target.value;
                                                                setVariants(v);
                                                            }}
                                                            placeholder="Size 42, Red, etc"
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            value={variant.stock}
                                                            onChange={(e) => {
                                                                const v = [...variants];
                                                                v[index].stock = parseInt(e.target.value) || 0;
                                                                setVariants(v);
                                                            }}
                                                            className="w-20 bg-white/5 border border-white/10 rounded-xl px-2 py-3 focus:border-pink-500 outline-none text-sm text-center"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariants(variants.filter((_, i) => i !== index))}
                                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                                <p className="text-[10px] text-gray-600 uppercase font-bold text-center py-2">Total stock will be calculated automatically</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Total Stock</label>
                                                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Product Images</label>

                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                            {imageFiles.map((img, index) => (
                                                <div key={index} className="aspect-square rounded-xl bg-white/5 border border-white/10 relative overflow-hidden group">
                                                    <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                            {imageFiles.length < 5 && (
                                                <label className="aspect-square rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all group">
                                                    <div className="text-xl text-gray-500 group-hover:text-pink-500 transition-colors">+</div>
                                                    <div className="text-[8px] text-gray-600 uppercase font-bold">Upload</div>
                                                    <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                                </label>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">Upload up to 5 images (Base64 storage)</p>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-gray-500 text-xs uppercase font-bold">Category</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowCategoryForm(!showCategoryForm)}
                                                className="text-pink-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                            >
                                                {showCategoryForm ? '✕ Cancel' : '+ Add New'}
                                            </button>
                                        </div>

                                        {!showCategoryForm ? (
                                            <div className="relative">
                                                <select
                                                    value={selectedCategory}
                                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none appearance-none transition-all"
                                                >
                                                    {categories.map(cat => <option key={cat.id} value={cat.id} className="bg-black">{cat.name}</option>)}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <input
                                                    type="text"
                                                    value={newCategoryName}
                                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                                    placeholder="Category name..."
                                                    className="flex-1 bg-white/5 border border-pink-500/30 rounded-xl px-4 py-3 focus:border-pink-500 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleCreateCategory}
                                                    disabled={submitting}
                                                    className="bg-pink-500 text-white font-bold px-4 rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50"
                                                >
                                                    ADD
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 text-xs uppercase font-bold mb-2">Description</label>
                                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-pink-500 outline-none h-32" placeholder="Tell buyers more..." />
                                    </div>

                                    <button type="submit" disabled={submitting} className="w-full bg-pink-500 text-white font-black py-4 rounded-xl hover:bg-pink-600 transition-all opacity-100 disabled:opacity-50">
                                        {submitting ? 'SAVING...' : editingProduct ? 'UPDATE PRODUCT' : 'PUBLISH PRODUCT'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* RIGHT: Product List */}
                        <div className={(isAddMode || editingProduct) ? 'lg:col-span-7' : 'lg:col-span-12'}>
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden">
                                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Store Inventory</h3>
                                        <p className="text-gray-500 text-xs mt-1 font-bold uppercase tracking-widest">{stores[0]?.name}</p>
                                    </div>
                                </div>

                                <div className="divide-y divide-white/5">
                                    {productsLoading ? (
                                        <div className="p-20 text-center text-gray-500">Loading products...</div>
                                    ) : products.length === 0 ? (
                                        <div className="p-20 text-center text-gray-500">No products in this store yet.</div>
                                    ) : (
                                        products.map(product => (
                                            <div key={product.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl overflow-hidden shadow-inner group-hover:scale-110 transition-transform">
                                                        {product.images && product.images.length > 0 ? (
                                                            <img src={product.images[0].imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            '📦'
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg group-hover:text-pink-500 transition-colors">{product.name}</h4>
                                                        <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                                            <span>${product.price.toFixed(2)}</span>
                                                            <span className="border-l border-white/10 pl-4">Stock: {product.stock}</span>
                                                            <span className="border-l border-white/10 pl-4 font-medium text-pink-500/80">{product.category?.name}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditClick(product)} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} className="p-3 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

        </main>
    );
}
