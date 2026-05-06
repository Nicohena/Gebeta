import Sidebar from "@/components/public/Sidebar";
import Hero from "@/components/public/Hero";
import FeaturedSection from "@/components/public/FeaturedSection";
import FoodSection from "@/components/public/FoodSection";
import DrinksSection from "@/components/public/DrinksSection";
import Footer from "@/components/public/Footer";
import LanguageSwitcher from "@/components/public/LanguageSwitcher";

// Simple SVG Icons for Header
const SearchIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const BagIcon = () => <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 relative">
        {/* Top Header */}
        <header className="flex items-center justify-end h-16 px-6 sm:px-10 gap-6 mt-16 md:mt-0">
          <div className="flex items-center gap-4">
            <button aria-label="Search" className="hover:bg-gray-100 p-2 rounded-full transition-colors">
              <SearchIcon />
            </button>
            <button aria-label="Cart" className="hover:bg-gray-100 p-2 rounded-full transition-colors relative">
              <BagIcon />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#F97316] rounded-full"></span>
            </button>
            <div className="border-l border-gray-200 h-6 mx-2"></div>
            <LanguageSwitcher />
          </div>
        </header>

        <div className="px-4 sm:px-8 max-w-6xl mx-auto pb-20">
          <Hero />
          <FeaturedSection />
          <DrinksSection />
          <FoodSection />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
