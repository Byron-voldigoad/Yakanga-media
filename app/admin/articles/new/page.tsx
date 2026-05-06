import { createClient } from '@/lib/server'
import NewArticleForm from './NewArticleForm'
import { ArrowLeft } from 'lucide-react'

export default async function NewArticlePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ edit?: string }> 
}) {
  const { edit: editId } = await searchParams
  const supabase = await createClient()
  
  const { data: categories } = await supabase.from('categories').select('id, name').order('name')
  const { data: { user } } = await supabase.auth.getUser()

  let initialData = null
  if (editId) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', editId)
      .single()
    initialData = data
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <a href="/admin/articles" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all shadow-sm">
          <ArrowLeft size={18} />
        </a>
        <div>
          <h1 className="text-3xl font-heading text-secondary uppercase tracking-tight">
            {editId ? 'Modifier l\'article' : 'Nouvel article'}
          </h1>
          <p className="text-sm text-muted-foreground italic font-ui mt-1">
            {editId ? 'Mise à jour du récit existant' : 'Création d\'un nouveau récit pour Yakanga'}
          </p>
        </div>
      </div>
      <NewArticleForm 
        categories={categories ?? []} 
        userId={user?.id ?? ''} 
        initialData={initialData} 
      />
    </div>
  )
}
