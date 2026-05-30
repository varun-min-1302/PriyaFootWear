import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Base routes
  const routes = [
    '',
    '/about',
    '/contact',
    '/products',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: products } = await supabase
      .from('products')
      .select('slug, created_at')
    
    if (products) {
      const productRoutes = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }))
      
      return [...routes, ...productRoutes]
    }
  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return routes
}
