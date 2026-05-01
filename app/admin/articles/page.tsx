'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import Link from 'next/link'
import { PlusCircle, LayoutGrid, List } from 'lucide-react'

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
  const [view, setView] = useState<'list' | 'grid'>('list')
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('articles')
      .select('id, title, slug, status, created_at, cover_url, categories(name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setArticles((data as any) ?? []))
  }, [])

  const statusStyle = (status: string) =>
    status === 'published' ? 'bg-green-50 text-green-700' :
    status === 'draft' ? 'bg-orange-50 text-orange-600' :
    'bg-gray-100 text-gray-400'

  const statusLabel = (status: string) =>
    status === 'published' ? 'Publié' :
    status === 'draft' ? 'Brouillon' : 'Archivé'

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-400 mt-0.5">{articles.length} articles</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Switch vue */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={15} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid size={15} />
            </button>
          </div>
          <Link href="/admin/articles/new"
            className="flex items-center gap-2 bg-[#2D6A2D] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a24] transition-colors">
            <PlusCircle size={15} />
            Nouvel article
          </Link>
        </div>
      </div>

      {/* Vue tableau */}
      {view === 'list' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider w-16">Image</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Titre</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Catégorie</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    {article.cover_url ? (
                      <img src={article.cover_url} alt="" className="w-12 h-9 object-cover rounded-lg" />
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-xs">—</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 truncate max-w-[220px]">{article.title}</p>
                    <p className="text-xs text-gray-300 mt-0.5 font-mono truncate max-w-[220px]">{article.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.categories?.name ?? '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(article.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-green-500' : article.status === 'draft' ? 'bg-orange-400' : 'bg-gray-300'}`} />
                      {statusLabel(article.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">{new Date(article.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/articles/new?edit=${article.id}`}
                      className="text-xs font-medium text-[#2D6A2D] opacity-0 group-hover:opacity-100 transition-opacity hover:underline">
                      Éditer →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Vue grille */}
      {view === 'grid' && (
        <div className="grid grid-cols-3 gap-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
              {article.cover_url ? (
                <img src={article.cover_url} alt="" className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-50 flex items-center justify-center text-gray-200 text-3xl">🖼️</div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{article.title}</p>
                  <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusStyle(article.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-green-500' : 'bg-orange-400'}`} />
                    {statusLabel(article.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  {article.categories?.name ?? 'Sans catégorie'} · {new Date(article.created_at).toLocaleDateString('fr-FR')}
                </p>
                <Link href={`/admin/articles/new?edit=${article.id}`}
                  className="text-xs font-medium text-[#2D6A2D] hover:underline">
                  Éditer →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
