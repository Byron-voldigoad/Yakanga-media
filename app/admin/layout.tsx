import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-900">Yakanga Admin</span>
          <a href="/admin" className="text-sm text-gray-600 hover:text-gray-900">Tableau de bord</a>
          <a href="/admin/articles" className="text-sm text-gray-600 hover:text-gray-900">Articles</a>
          <a href="/admin/articles/new" className="text-sm text-gray-600 hover:text-gray-900">+ Nouvel article</a>
        </div>
        <a href="/" className="text-sm text-gray-500 hover:text-gray-900">← Retour au site</a>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
