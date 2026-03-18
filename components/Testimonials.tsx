const testimonials = [
    {
        name: 'Alex Rivera',
        role: 'Fashion Influencer',
        quote: 'The Aero-Peak sneakers are quite literally the most comfortable and stylish pair I own. Constant compliments!',
        initials: 'AR',
    },
    {
        name: 'Sarah Chen',
        role: 'Creative Director',
        quote: 'Finally, a brand that understands the intersection of high fashion and technical sportswear. Brilliant collection.',
        initials: 'SC',
    },
    {
        name: 'Jordan Sparks',
        role: 'Streetwear Enthusiast',
        quote: 'The quality is unmatched. I\'ve been collecting sneakers for 10 years and these stand out as top tier.',
        initials: 'JS',
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-violet-600/20 blur-[120px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-violet-500 font-bold uppercase tracking-widest text-sm">Community</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2">WHAT THEY SAY</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex text-pink-500 mb-6">
                                {[...Array(5)].map((_, idx) => (
                                    <svg key={idx} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.37 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-300 mb-8 italic leading-relaxed">\"{t.quote}\"</p>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {t.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-white tracking-wide">{t.name}</p>
                                    <p className="text-sm text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
