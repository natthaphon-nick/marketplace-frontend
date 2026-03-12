'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as fetchCartApi } from '@/services/api';

interface CartItem {
    id: string;
    quantity: number;
    variantId?: string;
    variant?: { name: string, stock: number };
    product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        images?: { id: string, imageUrl: string }[];
    };
}

interface CartContextType {
    cart: { items: CartItem[] } | null;
    loading: boolean;
    refreshCart: () => Promise<void>;
    hasItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshCart = useCallback(async () => {
        try {
            const data = await fetchCartApi();
            setCart(data);
        } catch (error) {
            console.warn('Failed to fetch cart in context:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            refreshCart();
        } else {
            setLoading(false);
        }
    }, [refreshCart]);

    const hasItems = !!(cart?.items && cart.items.length > 0);

    return (
        <CartContext.Provider value={{ cart, loading, refreshCart, hasItems }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
