import { createClient } from '@/lib/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: total }, { count: published }, { count: drafts }] = await Promise.all([
    supabase.from('articles').select('*', { count: 'exact', head: true }),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
  ])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tableau de bord</h1>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Total articles</p>
          <p className="text-3xl font-bold text-gray-900">{total ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Publiés</p>
          <p className="text-3xl font-bold text-green-700">{published ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-1">Brouillons</p>
          <p className="text-3xl font-bold text-orange-500">{drafts ?? 0}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <a href="/admin/articles" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
          Gérer les articles
        </a>
        <a href="/admin/articles/new" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">
          + Nouvel article
        </a>
      </div>
    </div>
  )
}
