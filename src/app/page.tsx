import Sidebar from "@/components/public/Sidebar";
import Hero from "@/components/public/Hero";
import FeaturedSection from "@/components/public/FeaturedSection";
import FoodSection from "@/components/public/FoodSection";
import DrinksSection from "@/components/public/DrinksSection";
import Footer from "@/components/public/Footer";
import BottomNav from "@/components/public/BottomNav";

// No unused icons

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 relative">
        <div className="px-4 sm:px-8 max-w-6xl mx-auto pt-6 pb-24 md:pb-20">
          <Hero />
          <FeaturedSection />
          <DrinksSection />
          <FoodSection />
        </div>
        
        <Footer />
        <BottomNav />
      </main>
    </div>
  );
}
