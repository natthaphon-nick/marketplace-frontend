import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
                <div className="md:col-span-1">
                    <Link href="/" className="inline-block mb-6">
                        <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
                            MarketPlace
                        </span>
                    </Link>
                    <p className="leading-relaxed">
                        Defining the next generation of digital commerce. Premium products, unmatched quality, and high-contrast style.
                    </p>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Shop</h3>
                    <ul className="space-y-4">
                        <li><Link href="#shop" className="hover:text-pink-500 transition-colors">New Arrivals</Link></li>
                        <li><Link href="#shop" className="hover:text-pink-500 transition-colors">Best Sellers</Link></li>
                        <li><Link href="#shop" className="hover:text-pink-500 transition-colors">Exclusive Deals</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Support</h3>
                    <ul className="space-y-4">
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Order Tracking</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Shipping Info</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Returns & Refunds</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Stay Connected</h3>
                    <p className="mb-4">Join our newsletter for exclusive updates.</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Email address"
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-pink-500/50"
                            suppressHydrationWarning
                        />
                        <button
                            className="bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-pink-500 hover:text-white transition-colors"
                            suppressHydrationWarning
                        >
                            Join
                        </button>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                <p suppressHydrationWarning>© {new Date().getFullYear()} MarketPlace Inc. All rights reserved.</p>
                <div className="flex gap-8">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
                </div>
            </div>
        </footer>
    );
}
