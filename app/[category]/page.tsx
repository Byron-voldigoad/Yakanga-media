
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, User } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getArticlesByCategory } from "@/lib/queries/articles";
import { CATEGORIES_METADATA } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const metadata = CATEGORIES_METADATA[category];
  if (!metadata) return { title: "Catégorie non trouvée" };

  return {
    title: metadata.name,
    description: metadata.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryInfo = CATEGORIES_METADATA[category];

  if (!categoryInfo) {
    notFound();
  }

  const articles = await getArticlesByCategory(category);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Category Hero */}
        <section 
          className="relative py-20 overflow-hidden"
          style={{ backgroundColor: categoryInfo.color }}
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/az-subtle.png")` }} />
          
          <div className="container mx-auto px-4 relative z-10 text-white">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors font-ui font-medium text-sm"
            >
              <ArrowLeft className="h-4 w-4" /> Retour à l'accueil
            </Link>
            
            <div className="max-w-4xl">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm font-heading tracking-widest text-xs uppercase px-4 py-1.5 rounded-none mb-6">
                Rubrique
              </Badge>
              <h1 className="font-heading text-6xl md:text-8xl tracking-tighter uppercase leading-none mb-6">
                {categoryInfo.name}
              </h1>
              <p className="font-body text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed italic">
                {categoryInfo.description}
              </p>
            </div>
          </div>
          
          {/* Geometric accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 blur-2xl" />
        </section>

        {/* Articles Grid */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {articles.map((article) => (
                  <Link 
                    key={article.id} 
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col h-full bg-white border border-border overflow-hidden rounded-xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={article.cover_url || "/assets/placeholder.jpg"}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="absolute top-4 left-4">
                        <Badge 
                          className="font-heading text-[10px] uppercase tracking-widest px-3 py-1 rounded-none"
                          style={{ backgroundColor: categoryInfo.color, color: 'white' }}
                        >
                          {categoryInfo.name}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-4 mb-4 text-[11px] font-ui font-semibold text-muted-foreground uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h3 className="font-display text-2xl mb-4 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="font-body text-muted-foreground text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="pt-6 border-t border-border flex items-center justify-between">
                        <span className="flex items-center gap-2 font-ui text-xs font-bold text-secondary uppercase tracking-widest">
                          <div className="w-6 h-6 rounded-full bg-gray-200" />
                          Rédaction Yakanga
                        </span>
                        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted text-muted-foreground">
                  <Clock className="h-10 w-10" />
                </div>
                <h3 className="font-heading text-3xl uppercase mb-2">Aucun article pour le moment</h3>
                <p className="font-body text-muted-foreground text-lg mb-8">Nous préparons du contenu passionnant pour cette rubrique. Revenez bientôt !</p>
                <Link href="/">
                  <Badge className="bg-primary hover:bg-primary/90 text-white font-ui px-6 py-2 cursor-pointer transition-all">
                    Explorer d'autres rubriques
                  </Badge>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
