
'use client'

import React, { useState } from 'react'
import { Mail, Send, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { subscribeToNewsletter } from '@/lib/actions/newsletter'
import { toast } from 'sonner'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('email', email)

    const result = await subscribeToNewsletter(formData)
    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      setIsSubscribed(true)
      toast.success('Inscription réussie !')
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/az-subtle.png")` }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[32px] p-8 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl text-accent mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl text-secondary uppercase tracking-tight leading-none">
              Rejoignez le <span className="text-primary italic">Cercle</span> Yakanga
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Recevez chaque lundi notre sélection exclusive de récits culturels, portraits et analyses. Pas de spam, juste l'essentiel.
            </p>
          </div>

          <div className="w-full md:w-[400px]">
            {isSubscribed ? (
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4 animate-in fade-in zoom-in duration-500">
                <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-display text-2xl text-secondary">Merci de votre confiance !</h3>
                <p className="text-sm text-muted-foreground italic">Vérifiez votre boîte mail pour confirmer l'inscription.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-16 bg-muted/50 border-transparent focus-visible:ring-primary rounded-2xl font-ui"
                  />
                </div>
                <Button 
                  disabled={isSubmitting}
                  className="w-full h-16 bg-accent hover:bg-accent/90 text-white font-ui font-bold text-lg rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isSubmitting ? 'INSCRIPTION...' : 'S\'ABONNER À LA NEWSLETTER'}
                  <Send className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                  En vous inscrivant, vous acceptez notre politique de confidentialité.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
