import { index, integer, snakeCase, text, uuid, vector } from 'drizzle-orm/pg-core'
import { contentTable } from './content'
import { id, timestamps } from '@/lib/utils'


export const chunksTable = snakeCase.table(
  'chunks',
  {
    id,
    contentId: uuid()
      .notNull()
      .references(() => contentTable.id, { onDelete: 'cascade' }),
    // Only used for videos (caption offset); null for articles
    startPosition: integer(),
    // Populated by the embedding task; dimensions match text-embedding-3-small
    embedding: vector({ dimensions: 1536 }),
    text: text().notNull(),
    ...timestamps
  },
  (table) => [index('chunks_content_id_idx').on(table.contentId)],
)