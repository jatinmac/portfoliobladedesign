import { describe, expect, it } from 'vitest';

import type { RetrievalChunk } from './types';
import { planChunkIndex } from './indexing';

const chunk: RetrievalChunk = {
  id: 'sample#overview',
  sourceType: 'project',
  sourceSlug: 'sample',
  sourceTitle: 'Sample',
  projectSlug: 'sample',
  projectTitle: 'Sample',
  sectionTitle: 'Overview',
  content: 'Sample content',
  searchText: 'sample content',
  contentHash: 'hash-1',
  metadata: {
    sourceId: 'source-1',
  },
};

describe('planChunkIndex', () => {
  it('skips chunks with unchanged content hashes', () => {
    const plan = planChunkIndex([chunk], [
      {
        sourceId: 'source-1',
        chunkId: 'overview',
        contentHash: 'hash-1',
      },
    ]);

    expect(plan.unchanged).toHaveLength(1);
    expect(plan.changed).toHaveLength(0);
  });

  it('marks changed chunks for indexing', () => {
    const plan = planChunkIndex([chunk], [
      {
        sourceId: 'source-1',
        chunkId: 'overview',
        contentHash: 'old-hash',
      },
    ]);

    expect(plan.unchanged).toHaveLength(0);
    expect(plan.changed).toHaveLength(1);
  });
});
