import { createClient } from '@/lib/server'

export async function getFeaturedArticles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      created_at,
      categories (
        name,
        slug,
        color
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Erreur complète getFeaturedArticles:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    return []
  }
  return data
}

export async function getLatestArticles() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      created_at,
      categories (
        name,
        slug,
        color
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Erreur complète getLatestArticles:', {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      hint: error?.hint,
      status: error?.status
    })
    return []
  }
  return data
}
