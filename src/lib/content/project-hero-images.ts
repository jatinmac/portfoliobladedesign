import type { StaticImageData } from 'next/image';

const projectHeroImageLoaders: Record<string, () => Promise<{ default: StaticImageData }>> = {
  'double-ai-01.png': () => import('../../../assets/projects/double-ai-01.png'),
  'formula-1-design-youtube.png': () =>
    import('../../../assets/projects/formula-1-design-youtube.png'),
  'maruti-smartplay-pro-x.png': () =>
    import('../../../assets/projects/maruti-smartplay-pro-x.png'),
  'quilo.png': () => import('../../../assets/projects/quilo.png'),
  'u3k-instrument-cluster.png': () =>
    import('../../../assets/projects/u3k-instrument-cluster.png'),
};

export async function resolveProjectHeroImage(
  fileName: string,
): Promise<StaticImageData | undefined> {
  const loadImage = projectHeroImageLoaders[fileName];

  if (!loadImage) {
    return undefined;
  }

  const imageModule = await loadImage();
  return imageModule.default;
}
