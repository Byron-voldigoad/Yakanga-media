
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { Megaphone, Plus, Trash2, Power, LayoutGrid, List, MoreVertical, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Image from 'next/image'
import { toast } from 'sonner'

type Sponsor = {
  id: string
  name: string
  description: string
  image_url: string
  link_url: string
  position: string
  is_active: boolean
  views_count: number
  clicks_count: number
  created_at: string
}

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 8
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [view, setView] = useState<'grid' | 'table'>('grid')
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [position, setPosition] = useState('header')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSponsors()
  }, [page])

  async function fetchSponsors() {
    setLoading(true)
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, count } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)
      
    setSponsors(data || [])
    setTotalCount(count || 0)
    setLoading(false)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const ext = file.name.split('.').pop()
    const filename = `sponsors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from('covers') 
      .upload(filename, file, { upsert: true })

    if (error) {
      toast.error('Erreur d\'upload: ' + error.message)
    } else if (data) {
      const { data: urlData } = supabase.storage.from('covers').getPublicUrl(data.path)
      setImageUrl(urlData.publicUrl)
      toast.success('Bannière uploadée !')
    }
    setUploadingImage(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!imageUrl) {
      toast.error('Veuillez uploader une bannière.')
      return
    }

    setSaving(true)
    const sponsorData = {
      name,
      description,
      image_url: imageUrl,
      link_url: '#',
      position,
    }

    let error
    if (editingId) {
      const { error: err } = await supabase
        .from('sponsors')
        .update(sponsorData)
        .eq('id', editingId)
      error = err
    } else {
      const { error: err } = await supabase
        .from('sponsors')
        .insert({ ...sponsorData, is_active: true })
      error = err
    }

    setSaving(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(editingId ? 'Sponsor mis à jour' : 'Sponsor ajouté')
      resetForm()
      fetchSponsors()
    }
  }

  function resetForm() {
    setName('')
    setDescription('')
    setImageUrl('')
    setEditingId(null)
    setShowForm(false)
  }

  function handleEdit(sponsor: Sponsor) {
    setName(sponsor.name)
    setDescription(sponsor.description)
    setImageUrl(sponsor.image_url)
    setPosition(sponsor.position)
    setEditingId(sponsor.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (error) {
      toast.error(error.message)
    } else {
      fetchSponsors()
    }
  }

  async function deleteSponsor(id: string) {
    if (!confirm('Supprimer ce sponsor ?')) return
    const { error } = await supabase.from('sponsors').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
    } else {
      fetchSponsors()
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading text-secondary uppercase tracking-tight">Gestion Publicitaire</h1>
          <p className="text-sm font-ui text-muted-foreground mt-2 italic">Monétisation & Partenariats Yakanga</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white shadow-sm border border-border rounded-xl p-1">
            <button
              onClick={() => setView('table')}
              className={`p-2 rounded-lg transition-all ${view === 'table' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
              <List size={18} />
            </button>
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid size={18} />
            </button>
          </div>
          <Button 
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
            className="bg-accent hover:bg-accent/90 text-white rounded-2xl px-6 h-12 font-bold gap-2 shadow-lg shadow-accent/20"
          >
            {showForm ? 'ANNULER' : <><Plus size={20} /> NOUVEAU</>}
          </Button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl border border-border p-8 shadow-xl animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-heading text-secondary uppercase tracking-tight mb-6">
            {editingId ? 'Modifier le Sponsor' : 'Nouveau Sponsor'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nom du Partenaire</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Air France" required className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Position</label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header (728x90)</SelectItem>
                  <SelectItem value="sidebar">Sidebar (300x250)</SelectItem>
                  <SelectItem value="content">Article Body</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description / Message</label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Message publicitaire ou description interne..."
                className="w-full h-24 px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                required 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visuel de la campagne</label>
              {imageUrl ? (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border bg-muted/30">
                  <Image src={imageUrl} alt="Preview" fill className="object-contain" />
                  <button 
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-3 right-3 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => document.getElementById('sponsor-upload')?.click()}
                  className="w-full h-40 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <Megaphone className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-3" />
                  <span className="text-sm font-ui text-muted-foreground group-hover:text-primary transition-colors font-medium">
                    {uploadingImage ? 'Chargement...' : 'Cliquer pour uploader le visuel'}
                  </span>
                </div>
              )}
              <input id="sponsor-upload" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="md:col-span-2 pt-4">
              <Button type="submit" disabled={saving || uploadingImage} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl text-lg shadow-xl shadow-primary/10">
                {saving ? 'ENREGISTREMENT...' : editingId ? 'METTRE À JOUR' : 'ENREGISTRER LE SPONSOR'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <div className="h-12 w-12 bg-muted rounded-full mb-4" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      ) : view === 'table' ? (
        <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visuel</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Partenaire & Description</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Position</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Stats</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Statut</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sponsors.map(sponsor => (
                <tr key={sponsor.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-muted/20 border border-border">
                      <Image src={sponsor.image_url} alt="" fill className="object-contain p-1" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-display text-lg text-secondary">{sponsor.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1 italic">"{sponsor.description}"</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">{sponsor.position}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{sponsor.views_count} Vues</span>
                      <span className="text-[10px] font-bold text-primary uppercase">{sponsor.clicks_count} Clics</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={sponsor.is_active ? 'bg-primary text-white' : 'bg-muted-foreground text-white'}>
                      {sponsor.is_active ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical size={16} /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem onClick={() => handleEdit(sponsor)} className="gap-2"><Edit2 size={14}/> Modifier</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(sponsor.id, sponsor.is_active)} className="gap-2">
                          <Power size={14}/> {sponsor.is_active ? 'Désactiver' : 'Activer'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteSponsor(sponsor.id)} className="text-destructive gap-2 focus:text-destructive"><Trash2 size={14}/> Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sponsors.map(sponsor => (
            <div key={sponsor.id} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="relative h-44 w-full bg-muted/20 p-4">
                <Image src={sponsor.image_url} alt={sponsor.name} fill className="object-contain" />
                <div className="absolute top-4 right-4">
                  <Badge className={sponsor.is_active ? 'bg-primary text-white shadow-lg' : 'bg-muted-foreground text-white'}>
                    {sponsor.is_active ? 'ACTIF' : 'INACTIF'}
                  </Badge>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-xl text-secondary line-clamp-1">{sponsor.name}</h3>
                  <Badge variant="outline" className="text-[9px] uppercase">{sponsor.position}</Badge>
                </div>
                <p className="text-sm text-muted-foreground italic line-clamp-3 flex-1 mb-4">"{sponsor.description}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Vues</span>
                      <span className="text-xs font-bold">{sponsor.views_count}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">Clics</span>
                      <span className="text-xs font-bold text-primary">{sponsor.clicks_count}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(sponsor)} className="h-8 w-8"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleStatus(sponsor.id, sponsor.is_active)} className="h-8 w-8"><Power size={14} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSponsor(sponsor.id)} className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-10">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl h-12 px-6 font-bold"
          >
            PRÉCÉDENT
          </Button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === i + 1 ? 'bg-primary text-white shadow-lg' : 'bg-white border border-border text-muted-foreground hover:border-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl h-12 px-6 font-bold"
          >
            SUIVANT
          </Button>
        </div>
      )}
    </div>
  )
}
