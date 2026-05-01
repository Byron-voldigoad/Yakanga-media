import { createClient } from '@/lib/server'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, username')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'editor'].includes(profile.role)) redirect('/')

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      <AdminSidebar fullName={profile.full_name} role={profile.role} />
      <main className="ml-60 flex-1 bg-[#F5F4F0] min-h-screen">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
