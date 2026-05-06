
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, MessageSquare } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getArticleBySlug } from "@/lib/queries/articles";
import { getCommentsByArticleId } from "@/lib/queries/comments";
import CommentSection from "@/components/articles/CommentSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/server";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  if (!article) return { title: "Article non trouvé" };

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      images: [article.cover_url || "/assets/placeholder.jpg"],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const comments = await getCommentsByArticleId(article.id);

  const publishDate = new Date(article.published_at || article.created_at);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD]">
      <Navbar />

      <main className="flex-1">
        {/* Article Header / Hero */}
        <header className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px] overflow-hidden">
          <Image
            src={article.cover_url || "/assets/placeholder.jpg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 pb-12 md:pb-20">
            <div className="max-w-4xl space-y-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors font-ui font-medium text-sm group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
                Retour à l'actualité
              </Link>
              
              <div className="flex flex-wrap gap-3">
                <Badge 
                  className="font-heading tracking-widest text-[11px] uppercase px-4 py-1.5 rounded-none border-none text-white"
                  style={{ backgroundColor: article.categories?.color || '#2D6A2D' }}
                >
                  {/* @ts-ignore */}
                  {article.categories?.name || "Général"}
                </Badge>
              </div>

              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-white/90">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    {/* @ts-ignore */}
                    <AvatarImage src={article.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary text-white">
                      {/* @ts-ignore */}
                      {article.profiles?.full_name?.charAt(0) || "Y"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    {/* @ts-ignore */}
                    <span className="font-ui text-sm font-bold">{article.profiles?.full_name || "Rédaction Yakanga"}</span>
                    <span className="font-ui text-[10px] uppercase tracking-widest text-white/60">Auteur</span>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-white/20 hidden sm:block" />
                
                <div className="flex items-center gap-2 text-sm font-ui">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{publishDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-ui">
                  <Clock className="h-4 w-4 text-accent" />
                  <span>8 min de lecture</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              
              {/* Sidebar Left - Actions (Desktop) */}
              <aside className="hidden lg:flex lg:col-span-1 flex-col items-center gap-6 sticky top-32 h-fit">
                <div className="flex flex-col gap-4">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-accent hover:text-white transition-all">
                    <Bookmark className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white transition-all">
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </div>
                <div className="h-20 w-px bg-border" />
              </aside>

              {/* Main Content */}
              <article className="lg:col-span-8">
                <div className="prose prose-lg md:prose-xl prose-primary max-w-none">
                  {/* Summary/Excerpt */}
                  <p className="font-body text-2xl text-secondary font-medium italic leading-relaxed mb-12 border-l-4 border-accent pl-8">
                    {article.excerpt}
                  </p>

                  {/* Content (Rendering raw HTML for now, assuming it comes from an editor) */}
                  <div 
                    className="font-body text-text text-lg md:text-xl leading-[1.8] space-y-8 first-letter:text-6xl first-letter:font-display first-letter:mr-3 first-letter:float-left first-letter:text-primary"
                    dangerouslySetInnerHTML={{ __html: article.content }} 
                  />
                </div>

                {/* Tags Section */}
                <div className="mt-20 pt-10 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-heading text-xs uppercase tracking-widest mr-4 text-muted-foreground flex items-center">Tags :</span>
                    {["Culture", "Art", "Afrique", "Yakanga", "Tradition"].map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground hover:bg-primary hover:text-white transition-colors cursor-pointer rounded-none px-4 py-1">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Author Info Card */}
                <div className="mt-16 p-8 bg-[#F5F0C8]/50 border border-[#5C3A1E]/10 rounded-2xl flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {/* @ts-ignore */}
                    <AvatarImage src={article.profiles?.avatar_url} />
                    <AvatarFallback className="bg-primary text-white text-3xl">
                      {/* @ts-ignore */}
                      {article.profiles?.full_name?.charAt(0) || "Y"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="space-y-1">
                      {/* @ts-ignore */}
                      <h4 className="font-display text-2xl text-secondary">{article.profiles?.full_name || "Rédaction Yakanga"}</h4>
                      <p className="font-heading text-xs text-accent uppercase tracking-[0.2em]">Journaliste / Contributeur</p>
                    </div>
                    {/* @ts-ignore */}
                    <p className="font-body text-muted-foreground leading-relaxed italic">
                      {/* @ts-ignore */}
                      {article.profiles?.bio || "Passionné par les cultures contemporaines et la mémoire africaine, contribue régulièrement aux récits de Yakanga."}
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                      <Button variant="link" className="text-primary font-bold p-0 h-auto">Voir tous ses articles</Button>
                    </div>
                  </div>
                </div>

                {/* Comments Section */}
                <CommentSection 
                  articleId={article.id}
                  slug={article.slug}
                  initialComments={comments}
                  isLoggedIn={!!user}
                />
              </article>

              {/* Sidebar Right - Recommendation/Ad (Desktop) */}
              <aside className="lg:col-span-3 space-y-12">
                <div className="bg-primary text-white p-8 rounded-2xl shadow-xl shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <h5 className="font-heading text-xl mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent" />
                    Cercle Yakanga
                  </h5>
                  <p className="font-ui text-sm text-white/80 mb-6 italic">Ne manquez aucun de nos prochains grands récits culturels.</p>
                  <div className="space-y-4">
                    <input 
                      type="email" 
                      placeholder="Votre email..." 
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                    />
                    <Button className="w-full bg-accent hover:bg-white hover:text-primary transition-all font-bold">
                      S'ABONNER
                    </Button>
                  </div>
                </div>

                <div className="space-y-8">
                  <h5 className="font-heading text-lg border-b border-border pb-4 flex items-center justify-between">
                    <span>À LIRE AUSSI</span>
                    <ArrowLeft className="h-4 w-4 rotate-180 text-accent" />
                  </h5>
                  
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="group flex gap-4 items-center cursor-pointer">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0">
                          <div className="w-full h-full bg-gray-200 animate-pulse" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-heading text-[9px] text-accent tracking-widest uppercase">Rubrique</span>
                          <h6 className="font-body font-bold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            L'avenir des festivals d'art contemporain en Afrique centrale
                          </h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
