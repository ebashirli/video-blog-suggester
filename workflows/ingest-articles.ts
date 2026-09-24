import { FatalError } from 'workflow'
import { inArray, eq } from 'drizzle-orm'
import { db } from '@/db/db'
import { chunksTable, contentTable } from '@/db/schema'
import { BLOG_RSS_URL, parseArticleHtml, parseRss, type RssArticle } from '@/lib/articles'

const BATCH_SIZE = 10

export async function ingestArticles() {
  'use workflow'

  const articles = await getNewArticles()

  const failed: string[] = []
  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE)
    const results = await Promise.allSettled(batch.map((article) => ingestArticle(article)))
    results.forEach((result, j) => {
      if (result.status === 'rejected') failed.push(batch[j].url)
    })
  }

  return { found: articles.length, ingested: articles.length - failed.length, failed }
}

async function getNewArticles(): Promise<RssArticle[]> {
  'use step'

  const res = await fetch(BLOG_RSS_URL)
  if (!res.ok) throw new Error(`Failed to fetch RSS feed: ${res.status}`)
  const articles = parseRss(await res.text())
  if (articles.length === 0) return []

  const existing = await db
    .select({ url: contentTable.url })
    .from(contentTable)
    .where(inArray(contentTable.url, articles.map((a) => a.url)))
  const existingUrls = new Set(existing.map((row) => row.url))

  return articles.filter((article) => !existingUrls.has(article.url))
}

async function ingestArticle(article: RssArticle) {
  'use step'

  // Guard against a retry after a previous attempt already committed
  const [existing] = await db
    .select({ id: contentTable.id })
    .from(contentTable)
    .where(eq(contentTable.url, article.url))
  if (existing) return

  const res = await fetch(article.url)
  if (res.status === 404) throw new FatalError(`Article not found: ${article.url}`)
  if (!res.ok) throw new Error(`Failed to fetch ${article.url}: ${res.status}`)

  const parsed = parseArticleHtml(await res.text(), article.url)
  if (parsed == null) throw new FatalError(`No <article> <main> element found: ${article.url}`)

  const contentId = crypto.randomUUID()
  const insertContent = db.insert(contentTable).values({
    id: contentId,
    title: article.title,
    description: article.description,
    publishDate: new Date(article.publishDate),
    url: article.url,
    thumbnailUrl: parsed.thumbnailUrl,
    type: 'article',
    content: parsed.content,
  })

  if (parsed.chunks.length === 0) {
    await insertContent
    return
  }

  // neon-http batches run in a single transaction
  await db.batch([
    insertContent,
    db.insert(chunksTable).values(parsed.chunks.map((text) => ({ contentId, text }))),
  ])
}
