import type { Metadata } from 'next';

import {
  getChatConfig,
  getContentNavigationItems,
  getContactLinks,
  getExperienceItems,
  getExpertiseChips,
  getResumeHighlights,
  getSiteMetadataContent,
} from './content-loader';
import type { ContactLink, ExperienceItem, NavigationItem } from './types';

export const siteMetadata = getSiteMetadata();

export function buildPageMetadata(title: string, description: string, path: string): Metadata {
  const metadata = getSiteMetadata();

  return {
    title,
    description,
    alternates: {
      canonical: `${metadata.siteUrl}${path}`,
    },
  };
}

export function getNavigationItems(): NavigationItem[] {
  return getContentNavigationItems();
}

export function getPlaceholderSuggestions(): string[] {
  return getChatConfig().placeholderSuggestions;
}

export function getFollowUpConfig() {
  return getChatConfig().followUps;
}

export function getSiteMetadata() {
  return getSiteMetadataContent();
}

export const navigationItems: NavigationItem[] = getNavigationItems();
export const expertiseChips = getExpertiseChips();
export const experienceItems: ExperienceItem[] = getExperienceItems();
export const contactLinks: ContactLink[] = getContactLinks();
export const resumeHighlights = getResumeHighlights();
