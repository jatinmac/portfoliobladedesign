import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';

import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import {
  ArrowRightIcon,
  Badge,
  Box,
  Button,
  Divider,
  Heading,
  Text,
} from '../../components/blade/PortfolioPrimitives';
import { getContentDrivenPage, getContentPageHeader } from '../../lib/content/content-loader';
import { resolveProjectHeroImage } from '../../lib/content/project-hero-images';
import { getProjectSummaries } from '../../lib/content/projects';
import { buildPageMetadata } from '../../lib/content/site';
import type { ProjectSummary } from '../../lib/content/types';

export const dynamic = 'force-static';

export function generateMetadata(): Metadata {
  const pageHeader = getContentPageHeader('projects');
  return buildPageMetadata(pageHeader.title, pageHeader.description, '/projects');
}

export default async function ProjectsPage() {
  const projects = getProjectSummaries();
  const contentPage = getContentDrivenPage('projects');
  const projectImages = new Map(
    await Promise.all(
      projects.map(async (project) => [
        project.slug,
        project.heroImage ? await resolveProjectHeroImage(project.heroImage) : undefined,
      ] as const),
    ),
  );

  return (
    <ContentDrivenPageExperience page={contentPage}>
      <Box
        as="section"
        display="flex"
        flexDirection="column"
        gap="spacing.4"
      >
        <Box display="flex" flexDirection="column" gap="spacing.2" maxWidth="720px">
          <Heading as="h2" size="medium" color="surface.text.gray.normal">
            Case studies
          </Heading>
          <Text size="small" color="surface.text.gray.muted">
            Product work organized as outcomes, systems, and shipped surfaces.
          </Text>
        </Box>
        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', m: 'repeat(2, minmax(0, 1fr))' }}
          alignItems="stretch"
          gap="spacing.5"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              image={projectImages.get(project.slug)}
            />
          ))}
        </Box>
      </Box>
    </ContentDrivenPageExperience>
  );
}

type ProjectCardProps = {
  project: ProjectSummary;
  image?: StaticImageData;
};

function ProjectCard({ project, image }: ProjectCardProps) {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      minWidth="0px"
      height="100%"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      overflow="hidden"
      elevation="lowRaised"
    >
      <Box
        flex={{ base: '0 0 220px', m: '1 1 280px' }}
        minHeight={{ base: '220px', m: '280px' }}
        backgroundColor="surface.background.primary.subtle"
        position="relative"
        overflow="hidden"
      >
        {image ? (
          <Image
            src={image}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        ) : null}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.5"
        padding="spacing.5"
        flex="0 0 auto"
      >
        <Box display="flex" flexDirection="column" gap="spacing.3">
          <Box display="flex" flexWrap="wrap" gap="spacing.2">
            <Badge color="primary" size="small">
              {project.role}
            </Badge>
            <Badge color="primary" emphasis="subtle" size="small">
              {project.timeline}
            </Badge>
          </Box>

          <Box display="flex" flexDirection="column" gap="spacing.2">
            <Heading as="h3" size="medium">
              {project.title}
            </Heading>
            <Text color="surface.text.gray.muted" truncateAfterLines={4}>
              {project.summary}
            </Text>
          </Box>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={{ base: '1fr', s: 'repeat(2, minmax(0, 1fr))' }}
          gap="spacing.3"
        >
          <ProjectSignal label="Platform" value={project.platform ?? project.stack?.[0] ?? 'Product'} />
          <ProjectSignal label="Outcome" value={project.outcome ?? 'Case study'} />
        </Box>

        {project.tags?.length ? (
          <Box display="flex" flexWrap="wrap" gap="spacing.2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} color="neutral" emphasis="subtle" size="small">
                {tag}
              </Badge>
            ))}
          </Box>
        ) : null}

        <Divider />

        <Box marginTop="auto">
          <Button
            href={`/projects/${project.slug}`}
            variant="secondary"
            icon={ArrowRightIcon}
            iconPosition="right"
            isFullWidth
          >
            Open case study
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function ProjectSignal({ label, value }: { label: string; value: string }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="spacing.1"
      padding="spacing.3"
      borderRadius="medium"
      backgroundColor="surface.background.gray.subtle"
      minWidth="0px"
    >
      <Text variant="caption" size="small" weight="semibold" color="interactive.text.primary.normal">
        {label}
      </Text>
      <Text size="small" color="surface.text.gray.muted" truncateAfterLines={2}>
        {value}
      </Text>
    </Box>
  );
}
