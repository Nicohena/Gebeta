import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import FeaturedSection from "@/components/public/FeaturedSection";
import FoodSection from "@/components/public/FoodSection";
import DrinksSection from "@/components/public/DrinksSection";
import RewardsBanner from "@/components/public/RewardsBanner";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <FeaturedSection />
      <FoodSection />
      <DrinksSection />
      <RewardsBanner />
      <Footer />
    </main>
  );
}
