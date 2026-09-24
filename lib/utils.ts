import { timestamp, uuid } from "drizzle-orm/pg-core"

export const id = uuid().primaryKey().defaultRandom()

export const timestamps = {
     createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
     updatedAt: timestamp({ withTimezone: true })
          .defaultNow()
          .$onUpdate(() => new Date())
          .notNull()
}