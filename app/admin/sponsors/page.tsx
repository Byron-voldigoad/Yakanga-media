
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import { Megaphone, Plus, Trash2, Power } from 'lucide-react'
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
}

export default function AdminSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const pageSize = 5
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [position, setPosition] = useState('header')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchSponsors()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error("Erreur d'upload : " + error.message)
    } else if (data) {
      const { data: urlData } = supabase.storage.from('covers').getPublicUrl(data.path)
      setImageUrl(urlData.publicUrl)
      toast.success('Bannière uploadée !')
    }
    setUploadingImage(false)
  }

  async function handleAddSponsor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) { toast.error('Le nom est obligatoire.'); return }
    if (!description.trim()) { toast.error('La description est obligatoire.'); return }
    if (!imageUrl) { toast.error('Veuillez uploader une bannière.'); return }

    setSaving(true)
    const { error } = await supabase.from('sponsors').insert({
      name: name.trim(),
      description: description.trim(),
      image_url: imageUrl,
      link_url: '#',
      position,
      is_active: true,
    })
    setSaving(false)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Sponsor ajouté avec succès !')
      setName('')
      setDescription('')
      setImageUrl('')
      setPosition('header')
      setShowAddForm(false)
      fetchSponsors()
    }
  }

  async function toggleStatus(id: string, current: boolean) {
    const { error } = await supabase
      .from('sponsors')
      .update({ is_active: !current })
      .eq('id', id)
    if (error) toast.error(error.message)
    else fetchSponsors()
  }

  async function deleteSponsor(id: string) {
    if (!confirm('Supprimer ce sponsor ?')) return
    const { error } = await supabase.from('sponsors').delete().eq('id', id)
    if (error) toast.error(error.message)
    else fetchSponsors()
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading text-secondary uppercase tracking-tight">
            Gestion des Publicités
          </h1>
          <p className="text-sm font-ui text-muted-foreground mt-2 italic">
            {totalCount} sponsor(s) · Monétisation Yakanga
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-accent hover:bg-accent/90 text-white rounded-2xl px-6 h-14 font-bold gap-2"
        >
          {showAddForm ? 'ANNULER' : <><Plus size={20} /> AJOUTER UN SPONSOR</>}
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-3xl border border-border p-8 shadow-xl">
          <h2 className="text-xl font-heading text-secondary uppercase tracking-tight mb-6">
            Nouveau Sponsor
          </h2>
          <form onSubmit={handleAddSponsor} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Nom du Sponsor *
              </label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Air France"
                required
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Position *
              </label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Choisir une position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">Header (728×90)</SelectItem>
                  <SelectItem value="sidebar">Sidebar (300×250)</SelectItem>
                  <SelectItem value="content">Inline article</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Description *
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Détails de la campagne ou texte publicitaire..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                required
              />
            </div>

            {/* Banner Upload */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Bannière *
              </label>
              {imageUrl ? (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border bg-muted/30">
                  <Image src={imageUrl} alt="Aperçu" fill className="object-contain p-2" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-3 right-3 bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors text-lg"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => document.getElementById('sponsor-upload')?.click()}
                  className="w-full h-40 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <Megaphone className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <span className="text-sm font-ui text-muted-foreground group-hover:text-primary transition-colors">
                    {uploadingImage ? 'Upload en cours...' : 'Cliquer pour uploader la bannière'}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest mt-1">
                    Format recommandé : 728×90 (Header)
                  </span>
                </div>
              )}
              <input
                id="sponsor-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <Button
                type="submit"
                disabled={saving || uploadingImage}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
              >
                {saving ? 'ENREGISTREMENT...' : 'ENREGISTRER LE SPONSOR'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sponsors List */}
      <div className="space-y-6">
        {loading && (
          <div className="text-center py-12 text-muted-foreground italic text-sm">Chargement...</div>
        )}

        {!loading && sponsors.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground italic">Aucun sponsor pour le moment.</p>
          </div>
        )}

        {sponsors.map(sponsor => (
          <div
            key={sponsor.id}
            className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-all"
          >
            {/* Image */}
            <div className="relative w-full md:w-80 min-h-[10rem] bg-muted/20 flex items-center justify-center">
              <div className="relative w-full h-40">
                <Image src={sponsor.image_url} alt={sponsor.name} fill className="object-contain p-4" />
              </div>
              <div className="absolute top-4 left-4">
                <Badge className={sponsor.is_active ? 'bg-primary text-white' : 'bg-muted-foreground text-white'}>
                  {sponsor.is_active ? 'ACTIF' : 'INACTIF'}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start gap-4">
                <div className="min-w-0">
                  <h3 className="text-2xl font-display text-secondary">{sponsor.name}</h3>
                  <p className="text-sm text-muted-foreground italic mt-2 line-clamp-2">
                    "{sponsor.description}"
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Position : {sponsor.position}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {sponsor.views_count} vues
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {sponsor.clicks_count} clics
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    title={sponsor.is_active ? 'Désactiver' : 'Activer'}
                    onClick={() => toggleStatus(sponsor.id, sponsor.is_active)}
                    className="rounded-full"
                  >
                    <Power className={sponsor.is_active ? 'text-primary' : 'text-muted-foreground'} size={20} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Supprimer"
                    onClick={() => deleteSponsor(sponsor.id)}
                    className="rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="rounded-xl px-6"
          >
            PRÉCÉDENT
          </Button>
          <span className="text-sm font-ui font-bold text-muted-foreground uppercase tracking-widest">
            Page {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
            className="rounded-xl px-6"
          >
            SUIVANT
          </Button>
        </div>
      )}
    </div>
  )
}
