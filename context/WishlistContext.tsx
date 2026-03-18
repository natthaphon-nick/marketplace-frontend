'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WishlistItem {
    id: string; // Product ID
    name: string;
    price: number;
    imageUrl?: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (item: WishlistItem) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    hasItems: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        const stored = localStorage.getItem('wishlist');
        if (stored) {
            try {
                setWishlistItems(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse wishlist from local storage", e);
            }
        }
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToWishlist = (item: WishlistItem) => {
        setWishlistItems((prev) => {
            if (prev.some(i => i.id === item.id)) return prev;
            return [...prev, item];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlistItems((prev) => prev.filter(item => item.id !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                hasItems: wishlistItems.length > 0,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
