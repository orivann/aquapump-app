import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Technology from '@/components/Technology';
import Sustainability from '@/components/Sustainability';
import BrandShowcase from '@/components/BrandShowcase';
import Products from '@/components/Products';
import Chatbot from '@/components/Chatbot';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="bg-background">
        <Hero />
        <Features />
        <Technology />
        <Sustainability />
        <BrandShowcase />
        <Products />
        <Chatbot />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
