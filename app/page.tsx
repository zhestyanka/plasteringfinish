import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import PricingSection from "@/components/PricingSection"
import WorksSection from "@/components/WorksSection"
import VideoSection from "@/components/VideoSection"
import ReviewsSection from "@/components/ReviewsSection"
import TeamSection from "@/components/TeamSection"
import EquipmentSection from "@/components/EquipmentSection"
import ServicesSection from "@/components/ServicesSection"
import ContactsSection from "@/components/ContactsSection"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <Header />
      <main>
        <HeroSection />
        <PricingSection />
        <WorksSection />
        <VideoSection />
        <ReviewsSection />
        <TeamSection />
        <EquipmentSection />
        <ServicesSection />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  )
}
