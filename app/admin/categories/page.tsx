'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/services/api';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', imageUrl: '' });
    const [editCategory, setEditCategory] = useState({ id: '', name: '', imageUrl: '' });
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchCategories = async (page: number) => {
        setLoading(true);
        try {
            const result = await getCategories({ pageIndex: page, pageSize: 8 });
            setCategories(result.data);
            setTotalPages(result.totalPages);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(pageIndex);
    }, [pageIndex]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createCategory(newCategory);
            setNewCategory({ name: '', imageUrl: '' });
            setIsModalOpen(false);
            fetchCategories(pageIndex);
        } catch (error) {
            alert('Failed to create category');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                fetchCategories(pageIndex);
            } catch (error) {
                alert('Failed to delete category');
            }
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewCategory({ ...newCategory, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditCategory({ ...editCategory, imageUrl: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditOpen = (cat: any) => {
        setEditCategory({ id: cat.id, name: cat.name, imageUrl: cat.imageUrl || '' });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateCategory(editCategory.id, { name: editCategory.name, imageUrl: editCategory.imageUrl });
            setIsEditModalOpen(false);
            fetchCategories(pageIndex);
        } catch (error) {
            alert('Failed to update category');
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pb-12">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-24">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white mb-2">Category Management</h1>
                        <p className="text-gray-400 text-lg">Organize your store taxonomy and imagery.</p>
                    </div>
                    <button
                        onClick={() => {
                            setNewCategory({ name: '', imageUrl: '' });
                            setIsModalOpen(true);
                        }}
                        className="bg-gradient-to-r from-pink-600 to-violet-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
                    >
                        + New Category
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-3xl h-64 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((cat: any) => (
                            <div key={cat.id} className="group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-pink-500/50 transition-all">
                                <div className="h-40 bg-white/5 relative">
                                    {cat.imageUrl ? (
                                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs italic">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={() => handleEditOpen(cat)}
                                            className="p-3 bg-blue-600 rounded-full hover:scale-110 transition-transform"
                                            title="Edit Category"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-3 bg-red-600 rounded-full hover:scale-110 transition-transform"
                                            title="Delete Category"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0-.34-6m4.74-3.342 1.244 4.072M9.457 5.658L8.213 9.73M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-white group-hover:text-pink-500 transition-colors uppercase">{cat.name}</h3>
                                    <p className="text-gray-500 text-xs mt-1">ID: {cat.id.slice(0, 8)}...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPageIndex(p)}
                                className={`w-10 h-10 rounded-full font-bold transition-all ${pageIndex === p ? 'bg-pink-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                    value={newCategory.name}
                                    onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                                    placeholder="e.g., Electronics"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category Image</label>
                                <div className="relative group">
                                    <div className={`w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-colors ${newCategory.imageUrl ? 'border-pink-500/50' : 'hover:border-white/20'}`}>
                                        {newCategory.imageUrl ? (
                                            <div className="relative w-full h-full">
                                                <img src={newCategory.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setNewCategory({ ...newCategory, imageUrl: '' })}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600 mb-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                <p className="text-sm text-gray-500">Click to upload image</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-pink-600 font-bold hover:bg-pink-500 transition-colors shadow-[0_0_20px_rgba(219,39,119,0.3)]"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500"
                                    value={editCategory.name}
                                    onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Category Image</label>
                                <div className="relative group">
                                    <div className={`w-full h-48 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center overflow-hidden transition-colors ${editCategory.imageUrl ? 'border-pink-500/50' : 'hover:border-white/20'}`}>
                                        {editCategory.imageUrl ? (
                                            <div className="relative w-full h-full">
                                                <img src={editCategory.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setEditCategory({ ...editCategory, imageUrl: '' })}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-red-600 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-600 mb-2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                </svg>
                                                <p className="text-sm text-gray-500">Click to upload image</p>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleEditImageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-pink-600 font-bold hover:bg-pink-500 transition-colors shadow-[0_0_20px_rgba(219,39,119,0.3)]"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
