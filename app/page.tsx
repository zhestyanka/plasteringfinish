import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import ServicesSection from "@/components/ServicesSection"
import WorksSection from "@/components/WorksSection"
import PricingSection from "@/components/PricingSection"
import VideoSection from "@/components/VideoSection"
import ReviewsSection from "@/components/ReviewsSection"
import TeamSection from "@/components/TeamSection"
import EquipmentSection from "@/components/EquipmentSection"
import ContactsSection from "@/components/ContactsSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <WorksSection />
        <PricingSection />
        <VideoSection />
        <ReviewsSection />
        <TeamSection />
        <EquipmentSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  )
}
