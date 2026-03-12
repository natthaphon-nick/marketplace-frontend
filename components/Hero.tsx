import Image from 'next/image';
import { Button } from './ui/Button';

export default function Hero() {
    return (
        <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-[#050505] text-white overflow-hidden pt-20">
            {/* Decorative Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-pink-600/30 blur-[120px] rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-pink-500 uppercase bg-pink-500/10 border border-pink-500/20 rounded-full">
                    New Winter Collection 2024
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
                    STYLE BEYOND <br />
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 bg-clip-text text-transparent italic">
                        LIMITS.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Discover the future of fashion. Premium quality, sustainable materials, and designs that make a statement.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Button href="#shop" variant="primary" className="h-14 px-10 text-lg rounded-2xl bg-gradient-to-r from-pink-600 to-violet-600 hover:scale-105 transition-transform">
                        Shop Collection
                    </Button>
                    <Button href="#categories" variant="secondary" className="h-14 px-10 text-lg rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                        View Categories
                    </Button>
                </div>
            </div>

            {/* Product Highlight (Mock image or abstract shape) */}
            <div className="relative mt-20 w-full max-w-4xl h-64 md:h-96 mx-auto rounded-3xl overflow-hidden border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                <div className="absolute bottom-10 left-10 z-20 text-left">
                    <span className="text-pink-500 font-bold mb-2 block">Featured Item</span>
                    <h3 className="text-2xl font-bold">Aero-Peak Running Shoes</h3>
                </div>
                <div className="w-full h-full bg-[#111] flex items-center justify-center">
                    <div className="text-gray-800 text-9xl font-black select-none tracking-tighter">PREMIUM</div>
                </div>
            </div>
        </section>
    );
}
