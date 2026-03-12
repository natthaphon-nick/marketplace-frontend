'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import { Button } from '../../../components/ui/Button';
import { getAllUsers, deleteUser, updateUserByAdmin } from '@/services/api';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editForm, setEditForm] = useState({ firstName: '', lastName: '', role: '' });
    const [message, setMessage] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers(page, 10, search);
            setUsers(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            setSearch(searchInput);
        }, 500);
        return () => clearTimeout(delay);
    }, [page, searchInput]);

    useEffect(() => {
        fetchUsers();
    }, [page, search]);


    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteUser(id);
            fetchUsers();
        } catch (error) {
            alert('Failed to delete user');
        }
    };

    const handleEditClick = (user: any) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            role: user.role || 'USER'
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateUserByAdmin(editingUser.id, editForm);
            setMessage('User updated successfully');
            setEditingUser(null);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            alert('Failed to update user');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <main className="max-w-7xl mx-auto pt-24 px-4 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage all system users, roles and profiles.</p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none w-64"
                        />
                    </div>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl font-medium">
                        {message}
                    </div>
                )}

                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex justify-center">
                                                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No users found.</td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <img src={user.image} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 font-bold">
                                                            {user.email[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900 dark:text-white">
                                                            {user.firstName || ''} {user.lastName || ''}
                                                            {!user.firstName && !user.lastName && <span className="text-gray-400 italic font-normal">No Name Set</span>}
                                                        </div>
                                                        <div className="text-xs text-gray-500">{user.id.slice(0, 8)}...</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.email}</td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN'
                                                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        title="Edit user"
                                                        onClick={() => handleEditClick(user)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Pencil />
                                                    </button>
                                                    <button
                                                        title="Delete user"
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            <Button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page === totalPages}
                                variant="outline"
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit User</h2>
                            <p className="text-sm text-gray-500 italic truncate">{editingUser.email}</p>
                        </div>

                        <form onSubmit={handleUpdate} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={editForm.firstName}
                                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={editForm.lastName}
                                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">System Role</label>
                                <select
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-violet-500"
                                >
                                    <option value="USER">User</option>
                                    <option value="ADMIN">Super Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    variant="outline"
                                    className="flex-1 py-4"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="flex-1 py-4 bg-violet-600 hover:bg-violet-500"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
