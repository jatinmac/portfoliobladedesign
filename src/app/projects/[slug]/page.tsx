import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';
import { notFound } from 'next/navigation';

import {
  Badge,
  Box,
  Button,
  ExternalLinkIcon,
  Heading,
  Text,
} from '../../../components/blade/PortfolioPrimitives';
import { MarkdownTableBlock, renderInlineMarkdown } from '../../../components/MarkdownRenderer';
import { ProjectImageCarousel } from '../../../components/ProjectImageCarousel';
import { parseMarkdownBlocks, type MarkdownBlock } from '../../../lib/content/markdown';
import { resolveProjectImage, resolveProjectImages } from '../../../lib/content/project-images';
import { getAllProjects, getProjectBySlug } from '../../../lib/content/projects';
import { getSiteMetadata } from '../../../lib/content/site';
import type { Project } from '../../../lib/content/types';

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project not found',
    };
  }

  const siteMetadata = getSiteMetadata();

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `${siteMetadata.siteUrl}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectSections = getProjectSections(project.body);
  const introBlocks = getIntroBlocks(project.body);
  const primaryTags = [...(project.stack ?? []), ...(project.tags ?? [])].slice(0, 4);
  const [projectImage, projectImageCarousel, pitchDeckImageCarousel] = await Promise.all([
    project.heroImage ? resolveProjectImage(project.heroImage) : undefined,
    resolveProjectImages(project.galleryImages ?? []),
    resolveProjectImages(project.pitchDeckImages ?? []),
  ]);
  const designProcessSection = projectSections.find((section) => section.title === 'Design Process');
  const detailSections = projectSections.filter((section) => section.title !== 'Design Process');

  return (
    <Box minHeight="100svh" backgroundColor="surface.background.gray.intense">
      <Box
        as="main"
        display="flex"
        flexDirection="column"
        gap={{ base: 'spacing.5', l: 'spacing.6' }}
        padding={{ base: 'spacing.4', s: 'spacing.5', l: '56px' }}
        maxWidth="1040px"
        marginX="auto"
        minWidth="0px"
      >
        <Box display="flex" flexDirection="column" gap="spacing.4" minWidth="0px">
          <Box
            display="flex"
            flexDirection={{ base: 'column', m: 'row' }}
            justifyContent="space-between"
            alignItems={{ base: 'flex-start', m: 'flex-start' }}
            gap="spacing.4"
            minWidth="0px"
          >
            <Box display="flex" flexDirection="column" gap="spacing.2" maxWidth="760px">
              <Heading as="h1" size="2xlarge">
                {project.title}
              </Heading>
              <Text color="surface.text.gray.muted">{project.summary}</Text>
            </Box>

            {project.productUrl ? (
              <Button
                href={project.productUrl}
                target={project.productUrl.startsWith('http') ? '_blank' : undefined}
                rel={project.productUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                variant="primary"
                icon={ExternalLinkIcon}
                iconPosition="right"
                marginTop={{ base: 'spacing.0', m: 'spacing.1' }}
              >
                View Product
              </Button>
            ) : null}
          </Box>

          {primaryTags.length > 0 ? (
            <Box display="flex" flexWrap="wrap" gap="spacing.2">
              {primaryTags.map((tag) => (
                <Badge key={tag} color="neutral" size="small">
                  {tag}
                </Badge>
              ))}
            </Box>
          ) : null}
        </Box>

        <ProjectHeroMedia
          projectSlug={project.slug}
          projectTitle={project.title}
          image={projectImage}
          images={projectImageCarousel}
        />

        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', m: 'repeat(3, 1fr)' }}
          gap={{ base: 'spacing.4', m: 'spacing.5' }}
        >
          <ProjectInfoCard title="Product" value={project.platform ?? project.stack?.[0] ?? 'Project'} />
          <ProjectInfoCard title="My Role & Responsibility" value={project.role} />
          <ProjectInfoCard title="Timeline" value={project.timeline} />
        </Box>

        {designProcessSection ? <ProjectSectionCard section={designProcessSection} /> : null}

        {introBlocks.length > 0 ? (
          <ProjectSectionCard
            section={{
              title: 'Overview',
              blocks: introBlocks,
            }}
          />
        ) : null}

        <Box display="flex" flexDirection="column" gap={{ base: 'spacing.4', m: 'spacing.5' }}>
          {detailSections.map((section) => {
            const sectionCard = <ProjectSectionCard key={section.title} section={section} />;

            if (section.title !== 'Product' || pitchDeckImageCarousel.length === 0) {
              return sectionCard;
            }

            return (
              <Box key={section.title} display="flex" flexDirection="column" gap={{ base: 'spacing.4', m: 'spacing.5' }}>
                {sectionCard}
                <ProjectPitchDeckCarousel
                  projectSlug={project.slug}
                  projectTitle={project.title}
                  images={pitchDeckImageCarousel}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

type ProjectPitchDeckCarouselProps = {
  projectSlug: string;
  projectTitle: string;
  images: StaticImageData[];
};

function ProjectPitchDeckCarousel({ projectSlug, projectTitle, images }: ProjectPitchDeckCarouselProps) {
  return (
    <Box
      as="section"
      id="pitch-deck"
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      minWidth="0px"
    >
      <Box display="flex" flexDirection="column" gap="spacing.2">
        <Heading as="h2" size="medium">
          Pitch Deck
        </Heading>
        <Text color="surface.text.gray.muted">Product pitch deck snapshots for Double.ai.</Text>
      </Box>
      <ProjectImageCarousel
        images={images}
        projectSlug={projectSlug}
        projectTitle={`${projectTitle} pitch deck`}
        accessibilityLabel={`${projectTitle} pitch deck slides`}
        imageLabel={`${projectTitle} pitch deck slide`}
        linkHref={`/projects/${projectSlug}#pitch-deck`}
      />
    </Box>
  );
}

type ProjectHeroMediaProps = {
  projectSlug: string;
  projectTitle: string;
  image?: StaticImageData;
  images?: StaticImageData[];
};

function ProjectHeroMedia({ projectSlug, projectTitle, image, images }: ProjectHeroMediaProps) {
  if (images?.length) {
    return <ProjectImageCarousel images={images} projectSlug={projectSlug} projectTitle={projectTitle} />;
  }

  return (
    <Box
      position="relative"
      height="0px"
      paddingBottom="71.111111%"
      backgroundColor="surface.background.primary.subtle"
      borderRadius="medium"
      overflow="hidden"
      minWidth="0px"
      width="100%"
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          placeholder="blur"
          sizes="(min-width: 1200px) 1040px, (min-width: 768px) 80vw, 100vw"
          priority
          style={{ objectFit: 'contain' }}
        />
      ) : null}
    </Box>
  );
}

type ProjectInfoCardProps = {
  title: string;
  value: string;
};

function ProjectInfoCard({ title, value }: ProjectInfoCardProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.3"
      minHeight="96px"
      padding="spacing.5"
      backgroundColor="surface.background.primary.subtle"
      borderRadius="medium"
      minWidth="0px"
    >
      <Heading as="h2" size="small">
        {title}
      </Heading>
      <Text size="small" color="surface.text.gray.muted">
        {value}
      </Text>
    </Box>
  );
}

type ProjectSection = {
  title: string;
  blocks: MarkdownBlock[];
};

function ProjectSectionCard({ section }: { section: ProjectSection }) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      gap="spacing.4"
      padding={{ base: 'spacing.5', m: 'spacing.6' }}
      backgroundColor="surface.background.primary.subtle"
      borderRadius="medium"
      minWidth="0px"
    >
      <Heading as="h2" size="medium">
        {section.title}
      </Heading>

      <Box display="flex" flexDirection="column" gap="spacing.3">
        {section.blocks.map((block, index) => (
          <ProjectMarkdownBlock key={`${section.title}-${index}`} block={block} blockIndex={index} />
        ))}
      </Box>
    </Box>
  );
}

function ProjectMarkdownBlock({ block, blockIndex }: { block: MarkdownBlock; blockIndex: number }) {
  if (block.type === 'heading') {
    return (
      <Heading as="h3" size="small">
        {block.text}
      </Heading>
    );
  }

  if (block.type === 'list') {
    return (
      <Box display="flex" flexDirection="column" gap="spacing.2">
        {block.items.map((item, itemIndex) => (
          <Box key={`${item}-${itemIndex}`} display="flex" gap="spacing.2" alignItems="flex-start">
            <Text size="small" color="surface.text.gray.muted">
              {block.ordered ? `${itemIndex + 1}.` : '\u2022'}
            </Text>
            <Text size="small" color="surface.text.gray.muted" wordBreak="break-word">
              {renderInlineMarkdown(item, 'small', `project-list-${blockIndex}-${itemIndex}`)}
            </Text>
          </Box>
        ))}
      </Box>
    );
  }

  if (block.type === 'table') {
    return <MarkdownTableBlock block={block} blockIndex={blockIndex} isCompact />;
  }

  return (
    <Text color="surface.text.gray.muted" wordBreak="break-word">
      {renderInlineMarkdown(block.text, 'medium', `project-paragraph-${blockIndex}`)}
    </Text>
  );
}

function getIntroBlocks(markdown: Project['body']): MarkdownBlock[] {
  const blocks = parseMarkdownBlocks(markdown);
  const firstSectionIndex = blocks.findIndex((block) => block.type === 'heading' && block.level === 2);
  const introBlocks = firstSectionIndex === -1 ? blocks : blocks.slice(0, firstSectionIndex);

  return introBlocks.filter((block) => block.type !== 'heading');
}

function getProjectSections(markdown: Project['body']): ProjectSection[] {
  const sections: ProjectSection[] = [];
  let currentSection: ProjectSection | null = null;

  parseMarkdownBlocks(markdown).forEach((block) => {
    if (block.type === 'heading' && block.level === 2) {
      currentSection = {
        title: block.text,
        blocks: [],
      };
      sections.push(currentSection);
      return;
    }

    if (currentSection) {
      currentSection.blocks.push(block);
    }
  });

  return sections.filter((section) => section.blocks.length > 0);
}
