import * as cheerio from 'cheerio'
import type { AnyNode } from 'domhandler'
import { XMLParser } from 'fast-xml-parser'

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
    chunks: chunkByH2($, main.get(0)!),
  }
}

const BLOCK_TAGS = new Set([
  'address', 'article', 'aside', 'blockquote', 'br', 'dd', 'details', 'div',
  'dl', 'dt', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'header', 'hr', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section',
  'summary', 'table', 'td', 'th', 'tr', 'ul',
])
const SKIP_TAGS = new Set(['script', 'style', 'noscript', 'template', 'svg', 'iframe'])

/**
 * Splits the text of `root` into chunks that each start at an `h2`. Any text
 * before the first `h2` becomes its own chunk. The `h2` does not need to be a
 * direct child of `root`, so wrapper elements are handled.
 */
export function chunkByH2($: cheerio.CheerioAPI, root: AnyNode): string[] {
  const chunks: string[][] = [[]]
  const current = () => chunks[chunks.length - 1]

  function walk(node: AnyNode, inPre: boolean) {
    if (node.type === 'text') {
      current().push(inPre ? node.data : node.data.replace(/\s+/g, ' '))
      return
    }
    if (node.type !== 'tag') return

    const tag = node.name.toLowerCase()
    if (SKIP_TAGS.has(tag)) return

    if (tag === 'h2') {
      chunks.push([$(node).text().replace(/\s+/g, ' ').trim(), '\n'])
      return
    }

    const isBlock = BLOCK_TAGS.has(tag)
    if (isBlock) current().push('\n')
    for (const child of node.children) walk(child, inPre || tag === 'pre')
    if (isBlock) current().push('\n')
  }

  walk(root, false)

  return chunks.map((parts) => cleanText(parts.join(''))).filter(Boolean)
}

function cleanText(text: string) {
  return text
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, '').replace(/^ (?=\S)/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
