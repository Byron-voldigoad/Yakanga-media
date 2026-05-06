
import { createClient } from '@/lib/server'
import { Mail, Users, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 15

export default async function NewsletterSubscribersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam || '1'))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const { data: subscribers, count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .order('subscribed_at', { ascending: false })
    .range(from, to)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  // Stats
  const { count: confirmedCount } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_confirmed', true)

  const totalCount = count || 0
  const confirmed = confirmedCount || 0
  const pending = totalCount - confirmed

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading text-secondary uppercase tracking-tight">
          Abonnés Newsletter
        </h1>
        <p className="text-sm font-ui text-muted-foreground mt-2 italic">
          Gestion de la liste de diffusion Yakanga
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-border p-8 flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Users className="text-primary" size={26} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="text-4xl font-heading text-secondary mt-1">{totalCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" size={26} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Confirmés</p>
            <p className="text-4xl font-heading text-green-700 mt-1">{confirmed}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-border p-8 flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center">
            <XCircle className="text-amber-600" size={26} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">En attente</p>
            <p className="text-4xl font-heading text-amber-600 mt-1">{pending}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden overflow-x-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Mail className="text-primary" size={16} />
            </div>
            <p className="text-sm font-bold text-secondary uppercase tracking-widest">
              Liste des abonnés
            </p>
          </div>
          <p className="text-xs text-muted-foreground italic">
            {totalCount} abonné(s) · Page {page}/{totalPages || 1}
          </p>
        </div>

        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-muted/20 border-b border-border">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">#</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Statut</th>
              <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date d'inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subscribers?.map((sub, i) => (
              <tr key={sub.id} className="hover:bg-muted/10 transition-colors">
                <td className="px-8 py-4 text-xs text-muted-foreground font-mono">
                  {from + i + 1}
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary uppercase">
                        {sub.email[0]}
                      </span>
                    </div>
                    <span className="text-sm font-ui text-secondary">{sub.email}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  {sub.is_confirmed ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                      <CheckCircle size={12} /> Confirmé
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">
                      <XCircle size={12} /> En attente
                    </span>
                  )}
                </td>
                <td className="px-8 py-4 text-xs text-muted-foreground font-ui">
                  {new Date(sub.subscribed_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!subscribers || subscribers.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20">
            <Mail size={48} className="text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground italic text-sm">Aucun abonné pour le moment.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          {page > 1 ? (
            <a
              href={`?page=${page - 1}`}
              className="flex items-center gap-2 px-6 h-12 rounded-xl border border-border bg-white font-bold text-sm hover:border-primary hover:text-primary transition-all"
            >
              <ChevronLeft size={16} /> Précédent
            </a>
          ) : (
            <span className="flex items-center gap-2 px-6 h-12 rounded-xl border border-border bg-muted/20 font-bold text-sm text-muted-foreground/40 cursor-not-allowed">
              <ChevronLeft size={16} /> Précédent
            </span>
          )}

          <div className="flex items-center gap-2">
            {[...Array(Math.min(totalPages, 7))].map((_, i) => {
              const p = i + 1
              return (
                <a
                  key={p}
                  href={`?page=${p}`}
                  className={`w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center transition-all ${
                    page === p
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                >
                  {p}
                </a>
              )
            })}
          </div>

          {page < totalPages ? (
            <a
              href={`?page=${page + 1}`}
              className="flex items-center gap-2 px-6 h-12 rounded-xl border border-border bg-white font-bold text-sm hover:border-primary hover:text-primary transition-all"
            >
              Suivant <ChevronRight size={16} />
            </a>
          ) : (
            <span className="flex items-center gap-2 px-6 h-12 rounded-xl border border-border bg-muted/20 font-bold text-sm text-muted-foreground/40 cursor-not-allowed">
              Suivant <ChevronRight size={16} />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
