import { createClient } from '@/lib/server'

export default async function AdminArticles() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, status, created_at, categories(name)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-600',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
        <a href="/admin/articles/new" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800">
          + Nouvel article
        </a>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Titre</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Catégorie</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Statut</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles?.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">{article.title}</td>
                <td className="px-6 py-4 text-gray-500">
                  {(article.categories as any)?.name ?? '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[article.status] ?? ''}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(article.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-right">
                  <a href={`/admin/articles/new?edit=${article.id}`} className="text-blue-600 hover:underline text-xs">
                    Éditer
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
