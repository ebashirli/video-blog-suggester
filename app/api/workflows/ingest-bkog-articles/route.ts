import { start } from 'workflow/api'
import { NextResponse } from 'next/server'
import { ingestArticles } from '@/workflows/ingest-articles'

export async function POST() {
  const run = await start(ingestArticles)

  return NextResponse.json({ runId: run.runId })
}
