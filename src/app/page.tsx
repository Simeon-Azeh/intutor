import Features from "@/components/Features";
import Footer from "@/components/footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import NewsletterSection from "@/components/Newsletter";
import PartnerSlider from "@/components/PartnerSlider";
import Pricing from "@/components/Pricing";
import StudentAppSection from "@/components/StudentAppSection";
import Testimonials from "@/components/Testimonials";
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Home', };

export default function Home() {
  
  return (
    <div>
      <div className="top-0 sticky z-50">
      <Header />
      </div>
    <div>
      <Hero />
    </div>
    <div>
      <Features />
    </div>
    <div>
      <HowItWorks />
    </div>
    
    <div>
      <Testimonials />
    </div>
    <div>
      <PartnerSlider />
    </div>
    <div>
      <Pricing />
    </div>
    <div>
      <StudentAppSection />
    </div>
    <div>
      <NewsletterSection />
    </div>
    <div>
      <Footer />
    </div>
    </div>
  );
}
