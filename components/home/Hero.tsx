import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getFeaturedArticles } from "@/lib/queries/articles";

export default async function Hero() {
  const featuredArticles = await getFeaturedArticles();

  if (!featuredArticles || featuredArticles.length === 0) {
    return null; // Ou un squelette de chargement / état vide
  }

  const mainArticle = featuredArticles[0];
  const sideArticles = featuredArticles.slice(1);

  return (
    <section className="bg-primary py-12 md:py-20 text-white relative overflow-hidden">
      {/* African pattern background overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/az-subtle.png")` }} />
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <Badge className="bg-accent text-white font-heading tracking-[0.2em] text-[10px] uppercase px-3 py-1 rounded-none mb-4">
              Dossier Spécial
            </Badge>
            <h2 className="font-heading text-5xl md:text-7xl tracking-tighter uppercase leading-none">
              À la <span className="text-accent italic">Une</span>
            </h2>
          </div>
          <Link href="/articles" className="flex items-center gap-2 font-ui font-bold text-sm hover:text-accent transition-colors group border-b border-white/20 pb-1">
            EXPLORER TOUS LES RÉCITS <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Featured Article - African Branding Focus */}
          <div className="lg:col-span-8 group cursor-pointer">
            <Link href={`/articles/${mainArticle.slug}`}>
              <div className="relative aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-2xl shadow-3xl border border-white/10 transition-all duration-700 hover:border-accent/50">
                <Image
                  src={mainArticle.cover_url || "/assets/placeholder.jpg"}
                  alt={mainArticle.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                {/* Play Button Overlay (if video or just aesthetic) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play className="h-8 w-8 fill-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-accent" />
                    <span className="font-heading text-accent tracking-widest text-xs uppercase">
                      {/* @ts-ignore */}
                      {mainArticle.categories?.name || "Général"}
                    </span>
                  </div>
                  <h3 className="font-display text-4xl md:text-6xl leading-tight max-w-4xl group-hover:text-accent/90 transition-colors">
                    {mainArticle.title}
                  </h3>
                  <p className="font-body text-gray-300 text-lg md:text-xl line-clamp-2 max-w-2xl opacity-90 font-light leading-relaxed">
                    {mainArticle.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    <Button className="bg-white hover:bg-accent text-primary hover:text-white rounded-none font-ui font-bold px-10 h-14 transition-all duration-300">
                      LIRE LA SUITE
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-600 border border-white/20" />
                      <div className="flex flex-col">
                        <span className="font-ui text-sm font-bold">Rédaction Yakanga</span>
                        <span className="font-ui text-[10px] text-gray-400 uppercase tracking-widest">
                          {new Date(mainArticle.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Sidebar - Selection */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-secondary/50 backdrop-blur-md p-8 rounded-2xl border border-white/10 h-full flex flex-col">
              <h4 className="font-heading text-2xl mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-accent" />
                À ne pas manquer
              </h4>
              
              <div className="space-y-8 flex-1">
                {sideArticles.map((article) => (
                  <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-4 cursor-pointer">
                    <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={article.cover_url || "/assets/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1">
                      <span className="font-heading text-[10px] text-accent tracking-widest uppercase">
                        {/* @ts-ignore */}
                        {article.categories?.name}
                      </span>
                      <h5 className="font-body font-bold text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                        {article.title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Newsletter Minimalist */}
              <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
                <p className="font-display text-xl">Rejoignez le cercle</p>
                <p className="font-ui text-xs text-gray-400 italic">L'actualité culturelle, chaque lundi.</p>
                <div className="flex bg-white/5 rounded-none border border-white/10 p-1">
                  <Input 
                    placeholder="Email..." 
                    className="bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-500" 
                  />
                  <Button size="icon" className="bg-accent hover:bg-white hover:text-primary transition-all">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

