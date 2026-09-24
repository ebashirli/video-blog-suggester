import { id, timestamps } from '@/lib/utils'
import { date, pgEnum, snakeCase, text } from 'drizzle-orm/pg-core'

export const contentType = pgEnum('content_type', ['video', 'article'])

export const contentTable = snakeCase.table('content', {
  id,
  title: text().notNull(),
  description: text().notNull(),
  publishDate: date({ mode: 'date' }).notNull(),
  url: text().notNull().unique(),
  thumbnailUrl: text().notNull(),
  type: contentType().notNull(),
  content: text().notNull(),
  ...timestamps
})


