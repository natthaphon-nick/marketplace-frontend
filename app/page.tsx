import Navbar from '@/components/Navbar';
import Marquee from '@/components/Marquee';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Lookbook from '@/components/Lookbook';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-[#050505] min-h-screen selection:bg-pink-500 selection:text-white">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Lookbook />
      <ProductGrid />
      <BrandStory />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
