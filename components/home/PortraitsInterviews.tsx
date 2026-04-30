import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Édito", slug: "edito" },
  { name: "Actualités", slug: "actualites" },
  { name: "Opinions", slug: "opinions" },
  { name: "Mode", slug: "mode" },
  { name: "Kalara", slug: "kalara" },
  { name: "Portraits", slug: "portraits" },
  { name: "Interviews", slug: "interviews" },
];

export default function PortraitsInterviews() {
  return (
    <section className="py-20 bg-bg-cream/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <h2 className="font-heading text-3xl mb-10 text-secondary flex items-center gap-3">
              <span className="w-10 h-1 bg-accent rounded-full" />
              Portraits & Entretiens
            </h2>
            
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="relative w-full md:w-64 h-48 shrink-0 overflow-hidden rounded-lg">
                    <Image
                      src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000}?q=80&w=800&auto=format&fit=crop`}
                      alt="Portrait"
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-2 space-y-3">
                    <Badge variant="outline" className="w-fit text-primary border-primary/20 font-heading tracking-widest text-[10px] uppercase">PORTRAIT</Badge>
                    <h3 className="font-body text-2xl font-bold text-text group-hover:text-primary transition-colors">
                      L'héritage d'une icône : Regards sur le passé
                    </h3>
                    <p className="font-ui text-muted-foreground line-clamp-2">
                      Rencontre exclusive avec ceux qui façonnent la culture d'aujourd'hui en s'inspirant des racines profondes de notre continent.
                    </p>
                    <div className="flex items-center gap-4 text-xs font-ui text-muted-foreground italic">
                      <span>14 Oct 2023</span>
                      <span>•</span>
                      <span>8 min de lecture</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex justify-center">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white font-ui font-bold px-10 h-12">
                CHARGER PLUS D'ARTICLES
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-heading text-2xl mb-6 text-text border-b border-accent pb-2 w-fit">LES PLUS LUS</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <span className="font-heading text-3xl text-gray-200 group-hover:text-accent transition-colors leading-none">0{i}</span>
                    <div className="space-y-1">
                      <h4 className="font-body font-semibold text-[15px] leading-tight group-hover:text-primary transition-colors">
                        Pourquoi la rumba congolaise reste le socle de l'Afrique ?
                      </h4>
                      <span className="font-ui text-[11px] text-muted-foreground uppercase tracking-wider">Culture • Musique</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-secondary text-white rounded-xl p-6 shadow-lg shadow-secondary/20">
              <h3 className="font-heading text-2xl mb-6 text-bg-cream border-b border-white/20 pb-2 w-fit uppercase tracking-widest">Rubriques</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/${cat.slug}`}>
                    <Badge className="bg-white/10 hover:bg-accent hover:text-white text-bg-cream border-none font-ui font-medium px-4 py-1 transition-all cursor-pointer">
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-bg-cream p-8 rounded-xl border border-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full translate-x-1/2 -translate-y-1/2" />
              <Mail className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-display text-2xl text-secondary mb-2">Restons connectés</h3>
              <p className="font-ui text-sm text-secondary/70 mb-6 italic">Ne manquez aucun dossier exclusif de Yakanga.</p>
              <form className="space-y-3">
                <Input placeholder="Votre adresse email" className="bg-white border-primary/20 focus-visible:ring-primary h-12" />
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-ui font-bold tracking-wide">
                  REJOINDRE LA COMMUNAUTÉ
                </Button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
