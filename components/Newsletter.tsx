'use client';

export default function Newsletter() {
    return (
        <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 blur-[150px] rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-block px-4 py-1.5 mb-8 text-xs font-bold tracking-widest text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 rounded-full">
                    Join The Club
                </div>

                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                    EARLY ACCESS.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600">ZERO COMPROMISE.</span>
                </h2>

                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Sign up for our newsletter to get exclusive early access to limited edition drops, secret sales, and VIP events.
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="email"
                        placeholder="ENTER YOUR EMAIL"
                        className="flex-grow h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all font-medium tracking-wide"
                        required
                    />
                    <button
                        type="submit"
                        className="h-16 px-10 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-pink-500 hover:text-white transition-colors duration-300"
                    >
                        Subscribe
                    </button>
                </form>
                <div className="mt-6 text-sm text-gray-500 font-medium">
                    By subscribing, you agree to our <a href="#" className="text-pink-500 hover:underline">Terms of Service</a> and <a href="#" className="text-pink-500 hover:underline">Privacy Policy</a>.
                </div>
            </div>
        </section>
    );
}
