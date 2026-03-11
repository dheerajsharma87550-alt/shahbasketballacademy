import HeroSection from "@/components/HeroSection";
import BatchInfo from "@/components/BatchInfo";
import RegistrationForm from "@/components/RegistrationForm";
import AnnouncementsBanner from "@/components/AnnouncementsBanner";
import Footer from "@/components/Footer";
import AppSidebar from "@/components/AppSidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <HeroSection />
      <AnnouncementsBanner />
      <BatchInfo />
      <RegistrationForm />
      <Footer />
    </div>
  );
};

export default Index;
