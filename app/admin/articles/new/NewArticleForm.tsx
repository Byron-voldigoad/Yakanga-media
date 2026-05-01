'use client'
import { useState } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'

type Category = { id: number; name: string }

export default function NewArticleForm({ categories, userId }: { categories: Category[]; userId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [status, setStatus] = useState('draft')
  const [coverUrl, setCoverUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!title.trim()) { setError('Le titre est obligatoire'); return }
    setLoading(true)
    setError('')

    const slug = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()

    const { error: err } = await supabase.from('articles').insert({
      title,
      slug,
      content,
      cover_url: coverUrl || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      author_id: userId,
      status,
    })

    if (err) { setError(err.message); setLoading(false); return }
    router.push('/admin/articles')
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      {error && <div className="bg-red-50 border-l-4 border-red-600 text-red-700 px-4 py-3 rounded mb-6 text-sm">{error}</div>}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Titre *</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="Un titre percutant..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Catégorie</label>
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700">
            <option value="">Choisir une catégorie</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">URL image de couverture</label>
          <input value={coverUrl} onChange={e => setCoverUrl(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700"
            placeholder="https://images.unsplash.com/..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Contenu</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700 resize-none"
            placeholder="Rédigez votre article ici..." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Statut</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-700">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-50">
            {loading ? 'Publication...' : 'Enregistrer'}
          </button>
          <a href="/admin/articles" className="px-6 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
            Annuler
          </a>
        </div>
      </div>
    </div>
  )
}
