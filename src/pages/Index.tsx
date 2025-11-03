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
import AmbientBackground from '@/components/AmbientBackground';

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AmbientBackground />
      <Navbar />
      <main className="relative isolate bg-background/80">
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
