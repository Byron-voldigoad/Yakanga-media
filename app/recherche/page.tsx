import { createClient } from '@/lib/server'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/home/Navbar'
import Footer from '@/components/home/Footer'

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  let articles: any[] = []

  if (query) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select(`
        id, title, slug, excerpt, cover_url, created_at,
        categories ( name, slug )
      `)
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(20)

    articles = data || []
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1 w-full">
      
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Résultats pour "${query}"` : 'Recherche'}
          </h1>
          {query && (
            <p className="text-gray-500">
              {articles.length} article{articles.length !== 1 ? 's' : ''} trouvé{articles.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Formulaire de recherche */}
        <form action="/recherche" method="GET" className="mb-10">
          <div className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Rechercher un article..."
              autoFocus
              className="flex-1 border border-gray-200 rounded-full 
                         px-5 py-3 text-sm outline-none 
                         focus:border-green-700 transition-colors"
            />
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-3 
                         rounded-full text-sm font-semibold 
                         hover:bg-green-800 transition-colors"
            >
              Rechercher
            </button>
          </div>
        </form>

        {/* Résultats */}
        {!query && (
          <p className="text-center text-gray-400 py-20">
            Tapez un mot-clé pour rechercher des articles.
          </p>
        )}

        {query && articles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">
              Aucun article trouvé pour &quot;{query}&quot;
            </p>
            <p className="text-gray-400 text-sm">
              Essayez avec d&apos;autres mots-clés.
            </p>
          </div>
        )}

        <div className="space-y-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="flex gap-4 p-4 rounded-xl border border-gray-100 
                         hover:border-green-200 hover:bg-green-50 
                         transition-colors group"
            >
              {article.cover_url && (
                <div className="relative w-24 h-20 shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={article.cover_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {article.categories && (
                  <span className="text-xs font-semibold text-green-700 
                                   uppercase tracking-wide">
                    {article.categories.name}
                  </span>
                )}
                <h2 className="font-bold text-gray-900 mt-1 
                               group-hover:text-green-700 
                               transition-colors line-clamp-2">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
