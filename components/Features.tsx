import { ReactNode } from 'react';

const features = [
    {
        title: 'Premium Materials',
        description: 'Sourced from the finest sustainable materials to ensure quality and longevity.',
        icon: '✨',
    },
    {
        title: 'Express Delivery',
        description: 'Get your statement pieces delivered worldwide within 3-5 business days.',
        icon: '🚀',
    },
    {
        title: 'Exclusive Designs',
        description: 'Limited edition drops and unique collaborations you won\'t find anywhere else.',
        icon: '💎',
    },
    {
        title: 'Secure Checkout',
        description: 'Encrypted, seamless payments ensuring your shopping experience is completely safe.',
        icon: '🔒',
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-[#050505] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-pink-500 font-bold uppercase tracking-widest text-sm">Why Choose Us</span>
                    <h2 className="text-4xl md:text-5xl font-black text-white mt-2">THE PREMIUM EXPERIENCE</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feat, idx) => (
                        <div
                            key={idx}
                            className="bg-[#111] rounded-3xl p-8 border border-white/10 hover:border-pink-500/50 hover:-translate-y-2 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-violet-600/20 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                <span>{feat.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white group-hover:text-pink-500 transition-colors">
                                {feat.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
