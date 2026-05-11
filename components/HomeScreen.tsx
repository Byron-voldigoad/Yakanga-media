
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./home/Navbar";
import Hero from "./home/Hero";
import CulturalNews from "./home/CulturalNews";
import NewsletterSection from "./home/NewsletterSection";
import PortraitsInterviews from "./home/PortraitsInterviews";
import BannerAd from "./home/BannerAd";
import Footer from "./home/Footer";

export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* BANDE PUB */}
        <section className="bg-muted py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <BannerAd position="header" />
          </div>
        </section>

        <Hero />
        <CulturalNews />
        <NewsletterSection />
        <PortraitsInterviews />
      </main>

      <Footer />
    </div>
  );
}
