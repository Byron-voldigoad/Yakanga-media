
import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "./home/Navbar";
import Hero from "./home/Hero";
import CulturalNews from "./home/CulturalNews";
import PortraitsInterviews from "./home/PortraitsInterviews";
import Footer from "./home/Footer";

export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* BANDE PUB (Optional: could also be fragmented if reused) */}
        <section className="bg-muted py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-muted-foreground font-ui italic text-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
              <span className="relative z-10">Espace Publicitaire — 728x90</span>
            </div>
          </div>
        </section>

        <Hero />
        <CulturalNews />
        <PortraitsInterviews />
      </main>

      <Footer />

      {/* WHATSAPP FLOATING BUTTON */}
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-2xl shadow-green-500/30 z-[100] p-0 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="h-8 w-8 fill-current" />
      </Button>
    </div>
  );
}
