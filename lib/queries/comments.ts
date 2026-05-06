
import { createClient } from '@/lib/server'

export async function getCommentsByArticleId(articleId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      guest_name,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `)
    .eq('article_id', articleId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getCommentsByArticleId:', error)
    return []
  }
  return data
}
