import * as cheerio from 'cheerio'
import { XMLParser } from 'fast-xml-parser'
import { chunkArticles } from './chunking/chunkArticles'

export const BLOG_RSS_URL = 'https://blog.webdevsimplified.com/rss.xml'

export type RssArticle = {
  title: string
  description: string
  url: string
  publishDate: string
}

type RssItem = {
  title?: string
  description?: string
  link?: string
  pubDate?: string
}

export function parseRss(xml: string): RssArticle[] {
  const parser = new XMLParser({ isArray: (name) => name === 'item' })
  const items: RssItem[] = parser.parse(xml)?.rss?.channel?.item ?? []

  return items
    .filter((item) => item.link && item.title)
    .map((item) => ({
      title: String(item.title).trim(),
      description: String(item.description ?? '').trim(),
      url: normalizeUrl(String(item.link)),
      publishDate: new Date(item.pubDate ?? Date.now()).toISOString(),
    }))
}

export function normalizeUrl(url: string) {
  const parsed = new URL(url.trim())
  parsed.hash = ''
  return parsed.toString()
}

export function parseArticleHtml(html: string, pageUrl: string) {
  const $ = cheerio.load(html)

  const main = $('article main').first()
  if (main.length === 0) return null

  const ogImage =
    $('meta[property="og:image"]').attr('content') ??
    $('meta[name="og:image"]').attr('content')

  return {
    content: main.html()?.trim() ?? '',
    thumbnailUrl: ogImage ? new URL(ogImage, pageUrl).toString() : null,
    chunks: chunkArticles($, main.get(0)!),
  }
}


