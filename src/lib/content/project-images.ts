import type { StaticImageData } from 'next/image';

const projectImageLoaders: Record<string, () => Promise<{ default: StaticImageData }>> = {
  'double-ai-01.png': () => import('../../../assets/projects/double-ai-01.png'),
  'double-ai-02.png': () => import('../../../assets/projects/double-ai-02.png'),
  'DoubleAipitchdeck/Double ai 1.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 1.png'),
  'DoubleAipitchdeck/Double ai 2.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 2.png'),
  'DoubleAipitchdeck/Double ai 3.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 3.png'),
  'DoubleAipitchdeck/Double ai 4.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 4.png'),
  'DoubleAipitchdeck/Double ai 5.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 5.png'),
  'DoubleAipitchdeck/Double ai 6.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 6.png'),
  'DoubleAipitchdeck/Double ai 7.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 7.png'),
  'DoubleAipitchdeck/Double ai 8.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 8.png'),
  'DoubleAipitchdeck/Double ai 9.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 9.png'),
  'DoubleAipitchdeck/Double ai 10.png': () =>
    import('../../../assets/projects/DoubleAipitchdeck/Double ai 10.png'),
  'formula-1-design-youtube.png': () =>
    import('../../../assets/projects/formula-1-design-youtube.png'),
  'maruti-smartplay-pro-x.png': () =>
    import('../../../assets/projects/maruti-smartplay-pro-x.png'),
  'quilo.png': () => import('../../../assets/projects/quilo.png'),
  'u3k-instrument-cluster.png': () =>
    import('../../../assets/projects/u3k-instrument-cluster.png'),
};

export async function resolveProjectImage(
  fileName: string,
): Promise<StaticImageData | undefined> {
  const loadImage = projectImageLoaders[fileName];

  if (!loadImage) {
    return undefined;
  }

  const imageModule = await loadImage();
  return imageModule.default;
}

export async function resolveProjectImages(fileNames: string[]): Promise<StaticImageData[]> {
  const images = await Promise.all(fileNames.map((fileName) => resolveProjectImage(fileName)));
  return images.filter((image): image is StaticImageData => Boolean(image));
}
