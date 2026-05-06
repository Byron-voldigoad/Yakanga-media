import { createClient } from '@/lib/server'
import { PostgrestError } from '@supabase/supabase-js'

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

export async function getArticlesByCategory(categorySlug: string) {
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
      categories!inner (
        name,
        slug,
        color
      )
    `)
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur getArticlesByCategory:', error)
    return []
  }
  return data
}

export async function getArticleBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      cover_url,
      created_at,
      published_at,
      author_id,
      categories (
        name,
        slug,
        color
      ),
      profiles:author_id (
        full_name,
        avatar_url,
        bio
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Erreur getArticleBySlug:', error)
    return null
  }
  return data
}
