
'use server'

import { createClient } from '@/lib/server'
import { revalidatePath } from 'next/cache'

export async function postComment(formData: FormData) {
  const supabase = await createClient()
  
  const articleId = formData.get('articleId') as string
  const slug = formData.get('slug') as string
  const content = formData.get('content') as string
  const guestName = formData.get('guestName') as string
  
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase.from('comments').insert({
    article_id: articleId,
    author_id: user?.id || null,
    guest_name: user ? null : guestName,
    content: content,
    is_approved: true, // Auto-approving for now as per simplicity, or set to false for moderation
  })

  if (error) {
    console.error('Erreur postComment:', error)
    return { error: 'Une erreur est survenue lors de l\'envoi du commentaire.' }
  }

  revalidatePath(`/articles/${slug}`)
  return { success: true }
}
