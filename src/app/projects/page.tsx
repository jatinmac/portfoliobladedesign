import type { Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';

import { ContentDrivenPageExperience } from '../../components/page-layouts/ContentDrivenPageExperience';
import {
  ArrowRightIcon,
  Badge,
  Box,
  Button,
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
        padding={{ base: 'spacing.4', m: 'spacing.5' }}
        borderRadius="medium"
        backgroundColor="surface.background.primary.subtle"
      >
        <Heading as="h2" size="medium" color="surface.text.gray.normal">
          Case studies
        </Heading>
        <Box display="flex" flexWrap="wrap" gap="spacing.5">
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
      flexBasis={{ base: '100%', m: 'calc(50% - 10px)' }}
      minWidth={{ base: '100%', m: '300px' }}
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
      overflow="hidden"
      elevation="lowRaised"
    >
      <Box
        height={{ base: '240px', m: '292px' }}
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
            style={{ objectFit: 'contain' }}
          />
        ) : null}
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap="spacing.4"
        padding="spacing.5"
        flex="1"
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
