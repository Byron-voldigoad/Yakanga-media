import { createClient } from '@/lib/server'
import Link from 'next/link'
import { FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    { label: 'Total articles', value: total ?? 0, icon: FileText, color: 'text-secondary', bg: 'bg-secondary/5' },
    { label: 'Publiés', value: published ?? 0, icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Brouillons', value: drafts ?? 0, icon: Clock, color: 'text-accent', bg: 'bg-accent/10' },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading text-secondary uppercase tracking-tight">Tableau de bord</h1>
        <p className="text-sm font-ui text-muted-foreground mt-2 italic">La mémoire des cultures contemporaines — Administration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-3xl p-8 border border-border shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon size={20} className={color} />
              </div>
            </div>
            <p className={`text-5xl font-heading tracking-tighter ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Articles récents */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-muted/20">
            <h2 className="text-sm font-bold text-secondary uppercase tracking-widest">Articles récents</h2>
            <Link href="/admin/articles" className="text-xs text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              VOIR TOUT <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recent?.map((article) => (
              <div key={article.id} className="flex items-center justify-between px-8 py-5 hover:bg-[#F5F0C8]/20 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg text-secondary truncate group-hover:text-primary transition-colors">{article.title}</p>
                  <p className="text-xs font-ui text-muted-foreground mt-1">
                    {(article.categories as any)?.name ?? 'Général'} · {new Date(article.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <Badge variant="outline" className={`ml-4 shrink-0 font-heading text-[10px] uppercase tracking-widest ${
                  article.status === 'published' ? 'border-primary/20 text-primary' : 'border-accent/20 text-accent'
                }`}>
                  {article.status === 'published' ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-secondary p-8 rounded-3xl text-white shadow-xl shadow-secondary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="font-heading text-xl mb-6 relative z-10">ACTIONS RAPIDES</h3>
            <div className="space-y-4 relative z-10">
              <Link href="/admin/articles/new"
                className="flex items-center justify-center w-full bg-accent hover:bg-white hover:text-primary px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20">
                + NOUVEL ARTICLE
              </Link>
              <Link href="/admin/articles"
                className="flex items-center justify-center w-full bg-white/10 border border-white/20 hover:bg-white hover:text-secondary px-6 py-4 rounded-xl text-sm font-bold transition-all">
                GÉRER LE CONTENU
              </Link>
            </div>
          </div>
          
          <div className="bg-[#F5F0C8] p-8 rounded-3xl border border-[#5C3A1E]/10">
            <h3 className="font-heading text-lg text-[#5C3A1E] mb-4">REMARQUE</h3>
            <p className="font-body text-sm text-[#5C3A1E]/70 leading-relaxed italic">
              Yakanga est le gardien de la mémoire culturelle. Chaque article publié contribue à cet héritage précieux.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

