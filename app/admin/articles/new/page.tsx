import { createClient } from '@/lib/server'
import NewArticleForm from './NewArticleForm'

export default async function NewArticlePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <a href="/admin/articles" className="text-gray-400 hover:text-gray-600 text-sm">← Articles</a>
        <h1 className="text-2xl font-bold text-gray-900">Nouvel article</h1>
      </div>
      <NewArticleForm categories={categories ?? []} userId={user?.id ?? ''} />
    </div>
  )
}
