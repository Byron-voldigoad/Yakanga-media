import { createClient } from '@/lib/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, created_at')
    .eq('status', 'published')

  const articleUrls = (articles ?? []).map((article) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...articleUrls,
  ]
}
