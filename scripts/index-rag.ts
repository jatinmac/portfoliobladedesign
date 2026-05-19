import { getAllProjects } from '../src/lib/content/projects';
import { buildFullPortfolioSources } from '../src/lib/rag/chunks';
import { indexRagSources } from '../src/lib/rag/indexing';
import { createSupabaseServiceClient } from '../src/lib/supabase/server';

async function main(): Promise<void> {
  const projects = getAllProjects();
  const sources = buildFullPortfolioSources(projects);
  const supabase = createSupabaseServiceClient();

  console.log(`Indexing ${sources.length} portfolio RAG sources into Supabase...`);
  const result = await indexRagSources(supabase, sources);
  console.log(
    `Indexed ${result.sourceCount} sources and ${result.chunkCount} chunks (${result.skippedChunkCount} unchanged).`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
