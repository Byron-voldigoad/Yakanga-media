'use client'
import { useState } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Category = { id: number; name: string }

export default function NewArticleForm({ 
  categories, 
  userId,
  initialData
}: { 
  categories: Category[]; 
  userId: string;
  initialData?: any;
}) {
  const router = useRouter()
  const supabase = createClient()
  
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id ? String(initialData.category_id) : '')
  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft')
  const [coverUrl, setCoverUrl] = useState(initialData?.cover_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  async function handleSubmit() {
    if (!title.trim()) { setError('Le titre est obligatoire'); return }
    setLoading(true)
    setError('')

    const articleData = {
      title,
      content,
      cover_url: coverUrl || null,
      category_id: categoryId ? parseInt(categoryId) : null,
      status,
      updated_at: new Date().toISOString(),
    }

    let err
    if (initialData?.id) {
      // Update existing article
      const { error: updateErr } = await supabase
        .from('articles')
        .update(articleData)
        .eq('id', initialData.id)
      err = updateErr
    } else {
      // Insert new article
      const slug = title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        + '-' + Date.now()
        
      const { error: insertErr } = await supabase
        .from('articles')
        .insert({
          ...articleData,
          slug,
          author_id: userId,
        })
      err = insertErr
    }

    if (err) { 
      setError(err.message)
      setLoading(false)
      return 
    }
    
    router.push('/admin/articles')
    router.refresh()
  }

  return (
    <div className="max-w-4xl">

      {/* Topbar éditeur */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">
            ← Articles
          </Link>
          <span className="text-gray-200">/</span>
          <span className="text-sm text-gray-600 font-medium">{initialData ? 'Modifier l\'article' : 'Nouvel article'}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Toggle statut */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setStatus('draft')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                status === 'draft' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}>
              Brouillon
            </button>
            <button
              onClick={() => setStatus('published')}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                status === 'published' ? 'bg-[#2D6A2D] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}>
              Publier
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#1A1A1A] text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-black disabled:opacity-40 transition-colors">
            {loading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : (status === 'published' ? '↑ Publier' : '↓ Sauvegarder')}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">

        {/* Zone principale */}
        <div className="col-span-2 space-y-4">
          {/* Titre */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-2xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none"
              placeholder="Titre de l'article..."
            />
          </div>

          {/* Contenu */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={20}
              className="w-full text-gray-700 placeholder-gray-400 focus:outline-none resize-none leading-relaxed text-[15px]"
              placeholder="Commencez à rédiger votre article ici...

Vous pouvez écrire librement. Votre texte sera mis en forme à la publication."
            />
          </div>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">

          {/* Image de couverture */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Couverture</h3>
            {coverUrl ? (
              <div className="relative">
                <img src={coverUrl} alt="Aperçu" className="w-full h-36 object-cover rounded-xl" />
                <button
                  onClick={() => setCoverUrl('')}
                  className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-black/70">
                  ×
                </button>
              </div>
            ) : (
              <div
                onClick={() => document.getElementById('cover-upload')?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-[#2D6A2D] hover:bg-green-50/30 transition-all group">
                <span className="text-2xl mb-1">🖼️</span>
                <span className="text-gray-400 text-xs group-hover:text-[#2D6A2D] transition-colors">Cliquer pour uploader</span>
                <span className="text-gray-300 text-[10px] mt-0.5">JPG, PNG, WEBP</span>
              </div>
            )}
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setUploadingImage(true)
                const ext = file.name.split('.').pop()
                const filename = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
                const { data, error } = await supabase.storage
                  .from('covers')
                  .upload(filename, file, { upsert: true })
                if (!error && data) {
                  const { data: urlData } = supabase.storage.from('covers').getPublicUrl(data.path)
                  setCoverUrl(urlData.publicUrl)
                }
                setUploadingImage(false)
              }}
            />
            {uploadingImage && (
              <p className="text-xs text-[#2D6A2D] mt-2 text-center animate-pulse">Upload en cours...</p>
            )}
            <input
              value={coverUrl}
              onChange={e => setCoverUrl(e.target.value)}
              className="mt-3 w-full text-xs text-gray-500 border border-gray-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-200 placeholder-gray-300"
              placeholder="Ou coller une URL..."
            />
          </div>

          {/* Catégorie */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Catégorie</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCategoryId(categoryId === String(c.id) ? '' : String(c.id))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    categoryId === String(c.id)
                      ? 'bg-[#2D6A2D] text-white border-[#2D6A2D]'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                  }`}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Aperçu</h3>
            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Statut</span>
                <span className={`font-medium ${status === 'published' ? 'text-[#2D6A2D]' : 'text-orange-500'}`}>
                  {status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Mots</span>
                <span className="font-medium text-gray-700">
                  {content.trim() ? content.trim().split(/\s+/).length : 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Lecture</span>
                <span className="font-medium text-gray-700">
                  {Math.max(1, Math.ceil((content.trim().split(/\s+/).length || 0) / 200))} min
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
