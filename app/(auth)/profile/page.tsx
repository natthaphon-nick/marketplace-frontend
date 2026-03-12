'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { Button } from '../../../components/ui/Button';
import {
    logout,
    getMyProfile,
    updateMyProfile,
    deleteMyAccount,
    addAddress,
    updateAddress,
    deleteAddress,
} from '@/services/api';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [editForm, setEditForm] = useState<{ firstName: string; lastName: string; image?: string }>({ firstName: '', lastName: '' });
    const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

    // Address Management States
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [addressForm, setAddressForm] = useState({ address: '', phone: '' });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const fetchLatestProfile = async () => {
        try {
            const latestUser = await getMyProfile();
            setUser(latestUser);
            localStorage.setItem('user', JSON.stringify(latestUser));
            setEditForm({
                firstName: latestUser.firstName || '',
                lastName: latestUser.lastName || ''
            });
        } catch (error) {
            console.error('Failed to fetch latest profile', error);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setEditForm({
                firstName: parsedUser.firstName || '',
                lastName: parsedUser.lastName || ''
            });
            fetchLatestProfile(); // Sync with server for latest addresses etc.
        } else {
            window.location.href = '/login';
        }
        setIsLoading(false);
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ text: '', type: '' });
        try {
            // Send names and image together
            await updateMyProfile(editForm);
            await fetchLatestProfile();
            // Clear the temp image in form after success
            setEditForm(prev => ({ ...prev, image: undefined }));
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to update profile', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setEditForm(prev => ({ ...prev, image: base64String }));
        };
        reader.readAsDataURL(file);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ text: 'Passwords do not match', type: 'error' });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters', type: 'error' });
            return;
        }

        setIsSaving(true);
        try {
            await updateMyProfile({ password: passwordForm.newPassword });
            setIsChangingPassword(false);
            setPasswordForm({ newPassword: '', confirmPassword: '' });
            setMessage({ text: 'Password changed successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to change password', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user.addresses?.length >= 3) {
            setMessage({ text: 'You can only have up to 3 addresses.', type: 'error' });
            return;
        }
        setIsSaving(true);
        try {
            await addAddress(addressForm);
            await fetchLatestProfile();
            setIsAddingAddress(false);
            setAddressForm({ address: '', phone: '' });
            setMessage({ text: 'Address added successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to add address', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAddressId) return;
        setIsSaving(true);
        try {
            await updateAddress(editingAddressId, addressForm);
            await fetchLatestProfile();
            setEditingAddressId(null);
            setAddressForm({ address: '', phone: '' });
            setMessage({ text: 'Address updated successfully!', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to update address', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!window.confirm('Delete this address?')) return;
        try {
            await deleteAddress(id);
            await fetchLatestProfile();
            setMessage({ text: 'Address deleted successfully', type: 'success' });
            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        } catch (error) {
            setMessage({ text: 'Failed to delete address', type: 'error' });
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm('WARNING: Are you absolutely sure? This action cannot be undone and all your data will be permanently deleted.');
        if (!confirmed) return;

        try {
            await deleteMyAccount();
            logout();
            window.location.href = '/login';
        } catch (error) {
            alert('Failed to delete account. Please try again later.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <div className="text-6xl mb-6">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Please login to view your profile information.</p>
                    <Button href="/login" variant="primary" className="w-full">Go to Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <main className="max-w-4xl mx-auto pt-28 pb-12 px-4">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    {/* Header/Cover Area */}
                    <div className="h-48 bg-gradient-to-r from-pink-500 via-violet-600 to-indigo-700 relative">
                        <div className="absolute inset-0 bg-black/10"></div>
                    </div>

                    <div className="px-8 pb-12">
                        {/* Profile Info Header */}
                        <div className="relative flex flex-col items-center -mt-20 mb-10">
                            <div className="relative group p-1.5 bg-white dark:bg-gray-900 rounded-full shadow-2xl transition-transform hover:scale-105 duration-500">
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-900 shadow-inner">
                                    {(editForm.image || user.image) ? (
                                        <img
                                            src={editForm.image || user.image}
                                            alt={user.email}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-indigo-900/20 dark:to-pink-900/20 flex items-center justify-center text-5xl font-bold text-indigo-500 dark:text-indigo-400">
                                            {user.firstName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                                        </div>
                                    )}

                                    {/* Upload Overlay */}
                                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-bold uppercase tracking-widest gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        </svg>
                                        Update Photo
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>

                                    {uploadingImage && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h1 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight text-center">
                                {user.firstName || ''} {user.lastName || ''}
                                {!user.firstName && !user.lastName && <span className="text-gray-400 italic font-normal">No Name Set</span>}
                            </h1>
                            <div className="mt-2 flex items-center gap-2">
                                <span className={`px-4 py-1.5 ${user.role === 'ADMIN' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'} text-xs font-bold rounded-full uppercase tracking-widest`}>
                                    {user.role || 'User'}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Verified Account</span>
                            </div>
                        </div>

                        {message.text && (
                            <div className={`mb-8 p-4 rounded-2xl text-center text-sm font-bold ${message.type === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-100 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-600 border border-red-100 dark:border-red-800'
                                }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Details Sections */}
                        <div className="max-w-2xl mx-auto space-y-10">
                            <section>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Information</h2>
                                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md">Editable Info</span>
                                </div>

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="group p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-300">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">First Name</div>
                                            <input
                                                type="text"
                                                value={editForm.firstName}
                                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                                className="w-full bg-transparent text-gray-800 dark:text-gray-100 font-bold outline-none"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="group p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-300">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Last Name</div>
                                            <input
                                                type="text"
                                                value={editForm.lastName}
                                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                                className="w-full bg-transparent text-gray-800 dark:text-gray-100 font-bold outline-none"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        <div className="group p-6 bg-gray-100/50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-800 opacity-60">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">Email Address (Locked)</div>
                                            <input
                                                type="text"
                                                value={user.email}
                                                disabled
                                                className="w-full bg-transparent text-gray-500 font-bold cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="group p-6 bg-gray-100/50 dark:bg-gray-900/40 rounded-3xl border border-gray-100 dark:border-gray-800 opacity-60">
                                            <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">User ID (ReadOnly)</div>
                                            <div className="text-gray-500 dark:text-gray-400 font-mono text-xs truncate">{user.id}</div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isSaving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                                            Save Profile Info
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* Address Management Section */}
                            <section>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Addresses</h2>
                                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-md">
                                        {user.addresses?.length || 0}/3 Slots
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {user.addresses?.map((addr: any) => (
                                        <div key={addr.id} className="group p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/30 transition-all duration-300 flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="text-gray-800 dark:text-gray-100 font-bold flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-orange-500">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                                    </svg>
                                                    {addr.address}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                                    </svg>
                                                    {addr.phone}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingAddressId(addr.id);
                                                        setAddressForm({ address: addr.address, phone: addr.phone });
                                                        setIsAddingAddress(false);
                                                    }}
                                                    className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl text-gray-500 hover:text-indigo-500 transition-all hover:shadow-lg"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteAddress(addr.id)}
                                                    className="p-2 bg-red-50 dark:bg-red-900/10 border border-red-50 dark:border-red-900/20 rounded-xl text-red-500 hover:bg-red-100 transition-all"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {(isAddingAddress || editingAddressId) ? (
                                        <div className="p-8 bg-gray-50 dark:bg-gray-800/60 rounded-[2rem] border-2 border-orange-100 dark:border-orange-900/30">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-6">
                                                {editingAddressId ? 'Update Address' : 'Add New Address'}
                                            </h3>
                                            <form onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress} className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Address</label>
                                                    <textarea
                                                        value={addressForm.address}
                                                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 h-24 resize-none"
                                                        placeholder="House No., Street, City, ZIP Code..."
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                                                    <input
                                                        type="text"
                                                        value={addressForm.phone}
                                                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500"
                                                        placeholder="+66..."
                                                        required
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isSaving}
                                                        className="flex-1 py-3 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                                                    >
                                                        {isSaving ? 'Saving...' : (editingAddressId ? 'Save Address' : 'Add Address')}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsAddingAddress(false);
                                                            setEditingAddressId(null);
                                                            setAddressForm({ address: '', phone: '' });
                                                        }}
                                                        className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-500 rounded-2xl font-bold border border-gray-100 dark:border-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        user.addresses?.length < 3 && (
                                            <button
                                                onClick={() => setIsAddingAddress(true)}
                                                className="w-full p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400 font-bold hover:border-orange-500 hover:text-orange-500 transition-all group flex items-center justify-center gap-2"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:scale-125 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                Add New Address
                                            </button>
                                        )
                                    )}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Security Settings</h2>
                                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md">Safety</span>
                                </div>
                                <div className="p-2 space-y-2">
                                    {!isChangingPassword ? (
                                        <button
                                            onClick={() => setIsChangingPassword(true)}
                                            className="w-full flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-800/40 rounded-3xl border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-2xl text-pink-600 dark:text-pink-400 group-hover:scale-110 transition-transform">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">Change Password</div>
                                                    <div className="text-xs text-gray-500">Last changed recently</div>
                                                </div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-300">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="p-8 bg-gray-50 dark:bg-gray-800/60 rounded-[2rem] border-2 border-pink-100 dark:border-pink-900/30">
                                            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Update Your Password</h3>
                                            <form onSubmit={handleChangePassword} className="space-y-4">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.newPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        value={passwordForm.confirmPassword}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button
                                                        type="submit"
                                                        disabled={isSaving}
                                                        className="flex-1 py-3 bg-pink-600 text-white rounded-2xl font-bold hover:bg-pink-500 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50"
                                                    >
                                                        {isSaving ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setIsChangingPassword(false)}
                                                        className="px-6 py-3 bg-white dark:bg-gray-900 text-gray-500 rounded-2xl font-bold border border-gray-100 dark:border-gray-700"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleDeleteAccount}
                                        className="w-full flex items-center justify-between p-6 bg-red-50/30 dark:bg-red-900/10 rounded-3xl border border-red-50 dark:border-red-900/20 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group mt-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-2xl text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-red-600 dark:text-red-400">Delete Account</div>
                                                <div className="text-xs text-red-400/80">Permanently remove all your data</div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </section>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-[1.25rem] hover:opacity-90 transition-all text-center shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    window.location.href = '/login';
                                }}
                                className="w-full sm:w-auto px-10 py-4 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold rounded-[1.25rem] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-2">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">
                        Account created {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4">
                        <Link href="/terms" className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors uppercase font-bold tracking-widest">Terms</Link>
                        <Link href="/privacy" className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors uppercase font-bold tracking-widest">Privacy</Link>
                        <Link href="/help" className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors uppercase font-bold tracking-widest">Support</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
