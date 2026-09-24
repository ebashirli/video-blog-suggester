import { index, integer, snakeCase, text, timestamp, uuid, vector } from 'drizzle-orm/pg-core'
import { contentTable } from './content'


export const chunksTable = snakeCase.table(
  'chunks',
  {
    id: uuid().primaryKey().defaultRandom(),
    contentId: uuid()
      .notNull()
      .references(() => contentTable.id, { onDelete: 'cascade' }),
    // Only used for videos (caption offset); null for articles
    startPosition: integer(),
    // Populated by the embedding task; dimensions match text-embedding-3-small
    embedding: vector({ dimensions: 1536 }),
    text: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('chunks_content_id_idx').on(table.contentId)],
)