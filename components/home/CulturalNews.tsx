import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getLatestArticles } from "@/lib/queries/articles";

export default async function CulturalNews() {
  const latestArticles = await getLatestArticles();

  if (!latestArticles || latestArticles.length === 0) {
    return null;
  }

  return (
    <section className="bg-secondary py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-white/20" />
          <h2 className="font-heading text-4xl tracking-widest uppercase text-center">Actualités Culturelles</h2>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestArticles.map((news) => (
            <Link key={news.id} href={`/articles/${news.slug}`}>
              <Card className="bg-white rounded-lg overflow-hidden border-none shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer h-full">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={news.cover_url || "/assets/placeholder.jpg"}
                      alt={news.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-white font-heading text-[10px] tracking-tighter uppercase px-2 py-0.5 rounded-sm border-none">
                        {/* @ts-ignore */}
                        {news.categories?.name}
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
                  <span className="font-ui text-xs text-muted-foreground italic">
                    {new Date(news.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

