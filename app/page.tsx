import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-[#050505]">
      <Navbar />
      <Hero />
      <ProductGrid />
      <Footer />
    </main>
  );
}
