import Link from 'next/link';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    children: React.ReactNode;
    className?: string;
}

export function Button({ href, variant = 'primary', children, className = '', ...props }: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold transition-all focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<string, string> = {
        primary: 'bg-white text-black hover:bg-gray-200 shadow-lg',
        secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
        ghost: 'bg-transparent text-pink-500 hover:text-pink-400',
        outline: 'bg-transparent text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800',
    };

    const combinedClasses = `${baseClasses} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button className={combinedClasses} {...props}>
            {children}
        </button>
    );
}
