
'use client'

import React, { useState } from 'react'
import { MessageSquare, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { postComment } from '@/app/articles/actions'
import { toast } from 'sonner'

interface CommentSectionProps {
  articleId: string
  slug: string
  initialComments: any[]
  isLoggedIn: boolean
}

export default function CommentSection({ articleId, slug, initialComments, isLoggedIn }: CommentSectionProps) {
  const [content, setContent] = useState('')
  const [guestName, setGuestName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    if (!isLoggedIn && !guestName.trim()) {
      toast.error('Veuillez entrer votre nom.')
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('articleId', articleId)
    formData.append('slug', slug)
    formData.append('content', content)
    formData.append('guestName', guestName)

    const result = await postComment(formData)
    setIsSubmitting(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success('Commentaire envoyé !')
      setContent('')
      setGuestName('')
    }
  }

  return (
    <section className="mt-20 pt-10 border-t border-border">
      <div className="flex items-center gap-3 mb-10">
        <MessageSquare className="h-6 w-6 text-primary" />
        <h3 className="font-display text-3xl text-secondary">Commentaires ({initialComments.length})</h3>
      </div>

      {/* Comment Form */}
      <div className="bg-muted/30 p-8 rounded-2xl mb-12 border border-border">
        <h4 className="font-heading text-lg mb-6 uppercase tracking-wider">Laissez un commentaire</h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoggedIn && (
            <div className="space-y-2">
              <label className="font-ui text-xs font-bold uppercase tracking-widest text-muted-foreground">Votre nom</label>
              <Input 
                placeholder="Nom ou pseudo..." 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="bg-white border-border rounded-xl h-12 focus-visible:ring-primary"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="font-ui text-xs font-bold uppercase tracking-widest text-muted-foreground">Votre message</label>
            <Textarea 
              placeholder="Exprimez-vous..." 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white border-border rounded-xl min-h-[120px] focus-visible:ring-primary"
            />
          </div>
          <Button 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-white font-ui font-bold px-8 h-12 rounded-xl transition-all shadow-lg shadow-primary/20"
          >
            {isSubmitting ? 'ENVOI...' : 'PUBLIER LE COMMENTAIRE'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-10">
        {initialComments.length > 0 ? (
          initialComments.map((comment) => (
            <div key={comment.id} className="flex gap-6 group">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarImage src={comment.profiles?.avatar_url} />
                <AvatarFallback className="bg-primary/5 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-ui font-bold text-secondary">
                    {comment.profiles?.full_name || comment.guest_name || "Anonyme"}
                  </h5>
                  <span className="font-ui text-[10px] text-muted-foreground uppercase tracking-widest">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="bg-white border border-border p-5 rounded-2xl rounded-tl-none group-hover:border-primary/20 transition-colors shadow-sm">
                  <p className="font-body text-text leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground italic">
            Soyez le premier à réagir à cet article.
          </div>
        )}
      </div>
    </section>
  )
}
