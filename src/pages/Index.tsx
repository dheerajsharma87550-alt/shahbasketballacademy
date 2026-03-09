import HeroSection from "@/components/HeroSection";
import BatchInfo from "@/components/BatchInfo";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BatchInfo />
      <RegistrationForm />
      <Footer />
    </div>
  );
};

export default Index;
