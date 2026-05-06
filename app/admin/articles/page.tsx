'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import Link from 'next/link'
import { PlusCircle, LayoutGrid, List, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type Article = {
  id: string
  title: string
  slug: string
  status: string
  created_at: string
  cover_url: string | null
  categories: { name: string } | null
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [view, setView] = useState<'list' | 'grid'>('list')
  const pageSize = 10
  const supabase = createClient()

  useEffect(() => {
    const fetchArticles = async () => {
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      const { data, count } = await supabase
        .from('articles')
        .select('id, title, slug, status, created_at, cover_url, categories(name)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      setArticles((data as any) ?? [])
      setTotalCount(count ?? 0)
    }
    fetchArticles()
  }, [page, supabase])

  const statusStyle = (status: string) =>
    status === 'published' ? 'bg-[#2D6A2D]/10 text-[#2D6A2D]' :
    status === 'draft' ? 'bg-[#E8440A]/10 text-[#E8440A]' :
    'bg-gray-100 text-gray-400'

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-[#1A1A1A] uppercase tracking-tight">Gestion des Articles</h1>
          <p className="text-sm font-ui text-muted-foreground mt-1">
            {totalCount} articles trouvés · Page {page} sur {totalPages || 1}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white shadow-sm border border-border rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={18} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid size={18} />
            </button>
          </div>
          <Link href="/admin/articles/new"
            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20">
            <PlusCircle size={18} />
            NOUVEL ARTICLE
          </Link>
        </div>
      </div>

      {/* Articles List/Grid */}
      {view === 'list' ? (
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Aperçu</th>
                <th className="text-left px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Titre & Slug</th>
                <th className="text-left px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Rubrique</th>
                <th className="text-left px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Statut</th>
                <th className="text-left px-8 py-5 text-xs font-bold text-muted-foreground uppercase tracking-widest">Date</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-[#F5F0C8]/20 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-border">
                      <Image 
                        src={article.cover_url || "/assets/placeholder.jpg"} 
                        alt="" 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <p className="font-display text-lg text-secondary line-clamp-1">{article.title}</p>
                    <p className="text-[10px] font-ui text-muted-foreground uppercase tracking-wider mt-1">{article.slug}</p>
                  </td>
                  <td className="px-8 py-4">
                    <Badge variant="outline" className="font-heading text-[10px] uppercase tracking-widest border-primary/20 text-primary">
                      {article.categories?.name ?? 'Général'}
                    </Badge>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle(article.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-[#2D6A2D]' : 'bg-[#E8440A]'}`} />
                      {article.status === 'published' ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-xs font-ui text-muted-foreground">{new Date(article.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-8 py-4 text-right">
                    <Link href={`/admin/articles/new?edit=${article.id}`}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all text-muted-foreground">
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all group">
              <div className="relative h-48 w-full">
                <Image src={article.cover_url || "/assets/placeholder.jpg"} alt="" fill className="object-cover" />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg ${statusStyle(article.status)}`}>
                    {article.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <Badge variant="outline" className="font-heading text-[9px] uppercase tracking-widest mb-3">
                  {article.categories?.name ?? 'Général'}
                </Badge>
                <h3 className="font-display text-xl text-secondary line-clamp-2 mb-4 h-14">{article.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs font-ui text-muted-foreground">{new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                  <Link href={`/admin/articles/new?edit=${article.id}`}
                    className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1">
                    ÉDITER <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl px-4 border-border font-ui font-bold text-xs"
          >
            PRÉCÉDENT
          </Button>
          <div className="flex items-center gap-1 px-4">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i + 1 ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl px-4 border-border font-ui font-bold text-xs"
          >
            SUIVANT
          </Button>
        </div>
      )}
    </div>
  )
}
