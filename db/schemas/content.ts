import { date, index, integer, pgEnum, snakeCase, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core'

export const contentType = pgEnum('content_type', ['video', 'article'])

export const contentTable = snakeCase.table('content', {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text().notNull(),
  publishDate: date({ mode: 'date' }).notNull(),
  url: text().notNull().unique(),
  thumbnailUrl: text(),
  type: contentType().notNull(),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})


