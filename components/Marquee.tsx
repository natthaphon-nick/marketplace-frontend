import React from 'react';

export default function Marquee() {
    // Duplicate the content a few times to ensure seamless infinite scrolling
    const items = [
        "FREE WORLDWIDE SHIPPING",
        "EXCLUSIVE 2026 DROPS",
        "NEW WINTER COLLECTION",
        "LIMITED EDITION",
        "PREMIUM QUALITY",
    ];
    
    // Create an array with enough items to scroll smoothly
    const marqueeContent = [...items, ...items, ...items, ...items];

    return (
        <div className="w-full bg-pink-600 text-white overflow-hidden py-3 border-y border-pink-500/30">
            <div className="flex whitespace-nowrap animate-marquee">
                {marqueeContent.map((item, index) => (
                    <span key={index} className="mx-8 text-sm font-black tracking-widest uppercase flex items-center">
                        {item}
                        <span className="ml-8 text-pink-300/50 text-xs">✦</span>
                    </span>
                ))}
            </div>
        </div>
    );
}
