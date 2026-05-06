
'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'

type Sponsor = {
  id: string
  name: string
  description: string
  image_url: string
  link_url: string
}

export default function BannerAd({ position = 'header' }: { position?: string }) {
  const [ads, setAds] = useState<Sponsor[]>([])
  const [selected, setSelected] = useState<Sponsor | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchAds = async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('id, name, description, image_url, link_url')
        .eq('position', position)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (data && data.length > 0) {
        setAds(data)
        supabase.rpc('increment_sponsor_views', { sponsor_id: data[0].id })
      }
    }
    fetchAds()
  }, [position])

  const handleClick = async (ad: Sponsor) => {
    setSelected(ad)
    await supabase.rpc('increment_sponsor_clicks', { sponsor_id: ad.id })
  }

  if (ads.length === 0) {
    return (
      <div className="w-full h-20 sm:h-28 bg-muted/20 rounded-2xl flex items-center justify-center border border-dashed border-border/40">
        <p className="text-muted-foreground/30 text-[10px] font-bold uppercase tracking-[0.2em]">
          Espace Publicitaire
        </p>
      </div>
    )
  }

  // Triple for truly seamless loop regardless of ad count
  const items = [...ads, ...ads, ...ads]
  const duration = Math.max(20, ads.length * 8)

  return (
    <>
      <div className="relative w-full h-20 sm:h-28 overflow-hidden rounded-2xl bg-white border border-border/50 shadow-sm">
        {/* Left fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* "Sponsorisé" pill */}
        <div className="absolute top-2 right-6 z-20 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground/50">
            Partenaires
          </span>
        </div>

        {/* Scrolling track — keyframe injected via global style tag */}
        <div
          ref={trackRef}
          className="flex items-center h-full gap-16 px-12"
          style={{
            width: 'max-content',
            animation: `marquee-banner ${duration}s linear infinite`,
          }}
        >
          {items.map((ad, i) => (
            <button
              key={`${ad.id}-${i}`}
              type="button"
              onClick={() => handleClick(ad)}
              className="flex-shrink-0 h-12 sm:h-16 flex items-center transition-all duration-300 hover:opacity-70 hover:scale-105 focus:outline-none"
              title={ad.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.image_url}
                alt={ad.name}
                className="h-full w-auto object-contain max-w-[220px]"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Inject global keyframe — works with any CSS-in-JS or plain style tags */}
      <style>{`
        @keyframes marquee-banner {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>

      {/* Sponsor detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden">
          {selected && (
            <>
              {/* Banner image */}
              <div className="w-full h-40 bg-muted/30 flex items-center justify-center p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.image_url}
                  alt={selected.name}
                  className="max-h-full max-w-full object-contain drop-shadow-md"
                />
              </div>

              <div className="px-8 py-7 space-y-5">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display text-secondary">
                    {selected.name}
                  </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4">
                  {selected.description || 'Partenaire officiel Yakanga Média.'}
                </p>

                <a
                  href={selected.link_url === '#' ? undefined : selected.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors ${selected.link_url === '#' ? 'pointer-events-none opacity-30' : ''}`}
                >
                  <ExternalLink size={14} />
                  Visiter le site partenaire
                </a>

                <div className="flex items-center gap-1.5 pt-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Partenaire officiel Yakanga
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
