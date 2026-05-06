
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'
import Image from 'next/image'

export default function BannerAd({ position = 'header' }: { position?: string }) {
  const [ad, setAd] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchAd = async () => {
      const { data } = await supabase
        .from('sponsors')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (data) {
        setAd(data)
        // Increment view count (simple implementation)
        await supabase.rpc('increment_sponsor_views', { sponsor_id: data.id })
      }
    }
    fetchAd()
  }, [position, supabase])

  const handleClick = async () => {
    if (ad) {
      await supabase.rpc('increment_sponsor_clicks', { sponsor_id: ad.id })
    }
  }

  if (!ad) {
    return (
      <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-ui italic text-xs border border-border">
        Espace Publicitaire — 728x90
      </div>
    )
  }

  return (
    <a 
      href={ad.link_url} 
      target="_blank" 
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block w-full h-32 relative rounded-lg overflow-hidden border border-border shadow-md transition-transform hover:scale-[1.01]"
    >
      <Image 
        src={ad.image_url} 
        alt={ad.name} 
        fill 
        className="object-cover"
      />
      <div className="absolute top-2 right-2 bg-black/40 text-white text-[8px] px-1 rounded uppercase tracking-widest font-bold">
        Sponsorisé
      </div>
    </a>
  )
}
