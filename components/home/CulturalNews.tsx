import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

const culturalNews = [
  {
    id: 4,
    title: "Exposition majeure à Douala : 'Mémoires Vivantes'",
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?q=80&w=1974&auto=format&fit=crop",
    date: "18 Oct 2023",
    category: "Actualités",
  },
  {
    id: 5,
    title: "Festival de Cinéma : Les nouveaux visages du 7ème art",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop",
    date: "15 Oct 2023",
    category: "Découverte",
  },
  {
    id: 6,
    title: "Littérature : Le retour en force du roman épique",
    image: "https://images.unsplash.com/photo-1491843351663-7304c9ae654d?q=80&w=2070&auto=format&fit=crop",
    date: "12 Oct 2023",
    category: "Kalara",
  },
  {
    id: 7,
    title: "Design : L'habitat durable inspiré des cases obus",
    image: "https://images.unsplash.com/photo-1518005020453-6ec248d02344?q=80&w=1964&auto=format&fit=crop",
    date: "10 Oct 2023",
    category: "Opinions",
  },
];

export default function CulturalNews() {
  return (
    <section className="bg-secondary py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="font-heading text-4xl tracking-widest uppercase text-center">Actualités Culturelles</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {culturalNews.map((news) => (
            <Card key={news.id} className="bg-white rounded-lg overflow-hidden border-none shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={news.image}
                    alt={news.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-white font-heading text-[10px] tracking-tighter uppercase px-2 py-0.5 rounded-sm border-none">
                      {news.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <h3 className="font-body font-semibold text-text text-lg leading-tight line-clamp-3 mb-2 group-hover:text-primary transition-colors">
                  {news.title}
                </h3>
              </CardContent>
              <CardFooter className="p-5 pt-0 border-t border-border/10 flex items-center justify-between">
                <span className="font-ui text-xs text-muted-foreground italic">{news.date}</span>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
