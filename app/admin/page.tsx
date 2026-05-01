import { createClient } from '@/lib/server'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: total }, { count: published }, { count: drafts }] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
  ])

  const { data: recent } = await supabase
    .from('articles')
    .select('id, title, status, created_at, categories(name)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Total articles', value: total ?? 0, icon: FileText, color: 'text-gray-600', bg: 'bg-gray-100' },
    { label: 'Publiés', value: published ?? 0, icon: CheckCircle, color: 'text-[#2D6A2D]', bg: 'bg-[#2D6A2D]/10' },
    { label: 'Brouillons', value: drafts ?? 0, icon: Clock, color: 'text-[#E8440A]', bg: 'bg-[#E8440A]/10' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-400 mt-0.5">Vue d'ensemble de votre média</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <span className="text-xs text-gray-400 font-medium">{label}</span>
              <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon size={14} className={color} />
              </div>
            </div>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Articles récents */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Articles récents</h2>
          <Link href="/admin/articles" className="text-xs text-[#2D6A2D] font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Voir tout <ArrowRight size={12} />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent?.map((article) => (
            <div key={article.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-800 truncate">{article.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {(article.categories as any)?.name ?? 'Sans catégorie'} · {new Date(article.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <span className={`ml-4 shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                article.status === 'published' ? 'bg-green-50 text-green-700' :
                article.status === 'draft' ? 'bg-orange-50 text-orange-600' :
                'bg-gray-100 text-gray-500'
              }`}>
                {article.status === 'published' ? 'Publié' : article.status === 'draft' ? 'Brouillon' : 'Archivé'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex gap-3">
        <Link href="/admin/articles/new"
          className="bg-[#2D6A2D] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#245a24] transition-colors">
          + Nouvel article
        </Link>
        <Link href="/admin/articles"
          className="bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          Gérer les articles
        </Link>
      </div>
    </div>
  )
}
