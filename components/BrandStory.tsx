import React from 'react';

export default function BrandStory() {
    return (
        <section className="py-24 bg-[#050505] relative flex items-center min-h-[80vh] overflow-hidden border-t border-white/5">
            {/* Background Video / Image Cover (Using a styled div as placeholder if no video) */}
            <div className="absolute inset-0 bg-[#0a0a0a] z-0">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40 mix-blend-luminosity filter grayscale"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1fac08b042?q=80&w=2000&auto=format&fit=crop')` }}
                ></div>
                {/* Gradient overlays to blend into the sections above/below */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent"></div>
                {/* Dark overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/50"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <span className="text-white font-black uppercase tracking-[0.3em] text-sm text-shadow-sm drop-shadow-lg block mb-8">
                    Our Ethos
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tighter mb-10 drop-shadow-2xl">
                    NOT JUST CLOTHING.<br />
                    <span className="italic font-serif text-white/90">A MOVEMENT.</span>
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-300 font-medium leading-relaxed mb-12 drop-shadow-md">
                    Born in the underground, built for the future. We combine technical innovation with raw street culture to create pieces that define a generation. We don't follow trends. We set them.
                </p>

                <button className="h-16 px-12 text-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)]">
                    Read Our Story
                </button>
            </div>
        </section>
    );
}
