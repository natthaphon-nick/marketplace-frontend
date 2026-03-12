'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { logout } from '@/services/api';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const { hasItems: hasCartItems } = useCart();

    const handleLogout = async () => {
        logout();
        window.location.href = '/';
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setUser(JSON.parse(userStr));
        }
        setIsLoading(false);
    }, []);

    return (
        <nav className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                    <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                        MarketPlace
                    </div>
                </Link>
                <div className="hidden md:flex space-x-8">
                    <Link href="#shop" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Shop</Link>
                    <Link href="/categories" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Categories</Link>
                    <Link href="#deals" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Deals</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        {hasCartItems && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white dark:border-black animate-pulse"></span>
                        )}
                    </Link>
                    {isLoading ? (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse ml-2" />
                    ) : user ? (
                        <div className="relative ml-2">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center focus:outline-none"
                            >
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700 hover:border-pink-500 transition-colors"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold border border-white/20">
                                        {user.email?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl py-1 z-50">
                                    <Link
                                        href="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        href="/seller"
                                        className="block px-4 py-2 text-sm text-pink-500 font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        Seller Center
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <>
                                            <Link
                                                href="/admin/dashboard"
                                                className="block px-4 py-2 text-sm text-pink-600 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-800"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Admin Dashboard
                                            </Link>
                                            <Link
                                                href="/admin/users"
                                                className="block px-4 py-2 text-sm text-violet-600 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-800"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                User Management
                                            </Link>
                                            <Link
                                                href="/admin/categories"
                                                className="block px-4 py-2 text-sm text-orange-500 font-extrabold hover:bg-gray-100 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-800"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                Category Management
                                            </Link>
                                        </>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button href="/login" variant="primary" className="ml-2">Login</Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
