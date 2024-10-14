import Header from "@/components/Header";
import Hero from "@/components/Hero";
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
    </div>
  );
}
