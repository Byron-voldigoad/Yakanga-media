import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Édito", slug: "edito" },
  { name: "Actualités", slug: "actualites" },
  { name: "Opinions", slug: "opinions" },
  { name: "Mode", slug: "mode" },
  { name: "Kalara", slug: "kalara" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white pt-20 pb-10 border-t-4 border-accent">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="relative w-56 h-16 grayscale brightness-200 contrast-200">
              <Image
                src="/logo.png"
                alt="Yakanga Footer Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="font-body text-gray-400 text-lg italic max-w-md">
              "La mémoire des cultures contemporaines."
            </p>
            <p className="font-ui text-sm text-gray-500 leading-relaxed max-w-md">
              Yakanga Web Média explore les profondeurs de l'identité africaine et ses manifestations modernes. À travers l'art, la mode, la littérature et la musique, nous archivons le présent pour éclairer l'avenir.
            </p>
            <div className="flex items-center gap-4 pt-4">
              {[
                { id: 'facebook', img: '/social/facebook.jpg', alt: 'Facebook' },
                { id: 'x', img: '/social/x.png', alt: 'X' },
                { id: 'instagram', img: '/social/instagram.jpg', alt: 'Instagram' }
              ].map((social) => (
                <Button key={social.id} variant="ghost" size="icon" className="rounded-full bg-white/5 hover:bg-accent transition-all border border-white/10 p-1.5 overflow-hidden">
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={social.img}
                      alt={social.alt}
                      fill
                      className="object-cover brightness-110 contrast-110"
                    />
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-heading text-xl tracking-widest text-accent uppercase border-b border-accent/20 pb-2 w-fit">NAVIGATION</h4>
            <ul className="space-y-3 font-ui text-sm text-gray-400">
              {categories.map((cat) => (
                <li key={cat.slug}><Link href={`/${cat.slug}`} className="hover:text-accent transition-colors">→ {cat.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-heading text-xl tracking-widest text-accent uppercase border-b border-accent/20 pb-2 w-fit">À PROPOS</h4>
            <ul className="space-y-3 font-ui text-sm text-gray-400">
              <li><Link href="/qui-sommes-nous" className="hover:text-accent transition-colors">Qui sommes-nous ?</Link></li>
              <li><Link href="/equipe" className="hover:text-accent transition-colors">Notre équipe</Link></li>
              <li><Link href="/publicite" className="hover:text-accent transition-colors">Publicité</Link></li>
              <li><Link href="/mentions-legales" className="hover:text-accent transition-colors">Mentions légales</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-heading text-xl tracking-widest text-accent uppercase border-b border-accent/20 pb-2 w-fit">CONTACT</h4>
            <div className="space-y-4 font-ui text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>+237 600 000 000</span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>contact@yakanga.media</span>
              </div>
              <div className="bg-white/5 p-4 rounded-lg border border-white/10 mt-6">
                <p className="text-xs text-gray-500 italic mb-2">Bureaux :</p>
                <p className="text-gray-300">Quartier Bastos, Douala, Cameroun</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-ui text-gray-600 uppercase tracking-widest">
          <p>© {new Date().getFullYear()} YAKANGA MEDIA. TOUS DROITS RÉSERVÉS.</p>
          <p>DESIGN & DÉVELOPPEMENT : ANTIGRAVITY STUDIO</p>
        </div>
      </div>
    </footer>
  );
}
