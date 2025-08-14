import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://yourstore.com'
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /checkout
Disallow: /cart
Disallow: /account
Disallow: /orders

# Allow search engines to crawl important pages
Allow: /search
Allow: /category/
Allow: /categories/
Allow: /product/
Allow: /categories
Allow: /privacy-policy

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}