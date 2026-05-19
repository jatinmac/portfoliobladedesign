import { readEnv } from '../env';

export const RAG_EMBEDDING_DIMENSIONS = 384;
export const DEFAULT_RAG_EMBEDDING_MODEL = 'Xenova/gte-small';

type FeatureExtractionPipeline = (
  input: string,
  options: { pooling: 'mean'; normalize: boolean },
) => Promise<{ data: Float32Array | number[] }>;

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

export function getRagEmbeddingModel(): string {
  return readEnv('RAG_EMBEDDING_MODEL', DEFAULT_RAG_EMBEDDING_MODEL);
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const result = await extractor(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(result.data);

  if (embedding.length !== RAG_EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Expected ${RAG_EMBEDDING_DIMENSIONS} embedding dimensions, got ${embedding.length}.`,
    );
  }

  return embedding;
}

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = import('@xenova/transformers').then(async ({ env, pipeline }) => {
      env.allowLocalModels = false;
      return pipeline('feature-extraction', getRagEmbeddingModel()) as Promise<FeatureExtractionPipeline>;
    });
  }

  return extractorPromise;
}
