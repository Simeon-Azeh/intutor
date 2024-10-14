import Features from "@/components/Features";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Image from "next/image";

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
    </div>
  );
}
