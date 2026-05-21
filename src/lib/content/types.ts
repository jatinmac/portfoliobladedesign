export type ProjectFrontmatter = {
  title: string;
  slug: string;
  order?: number;
  summary: string;
  role: string;
  timeline: string;
  chatContext?: string;
  tags?: string[];
  stack?: string[];
  platform?: string;
  outcome?: string;
  productUrl?: string;
  heroImage?: string;
  galleryImages?: string[];
  pitchDeckImages?: string[];
};

export type Project = ProjectFrontmatter & {
  body: string;
  sourcePath: string;
};

export type ProjectSummary = ProjectFrontmatter;

export type NavigationItem = {
  label: string;
  href: string;
};

export type ContentPage = {
  slug: string;
  navigationLabel: string;
  path: string;
  title: string;
  body: string;
  frontmatter: Record<string, unknown>;
  sourcePath: string;
};

export type SiteMetadataContent = {
  name: string;
  title: string;
  description: string;
  siteUrl: string;
};

export type ChatConfig = {
  placeholderSuggestions: string[];
  followUps: {
    project: string[];
    designSystem: string[];
    default: string[];
  };
};

export type ContentPageHeader = {
  eyebrow: string;
  title: string;
  description: string;
};

export type ContentPageListItem = {
  text: string;
  label?: string;
  value?: string;
  href?: string;
};

export type ContentPageSectionBlock =
  | {
      type: 'paragraph';
      text: string;
    }
  | {
      type: 'list';
      ordered: boolean;
      items: ContentPageListItem[];
    };

export type ContentPageSection = {
  title: string;
  blocks: ContentPageSectionBlock[];
  subsections: ContentPageSection[];
};

export type ContentDrivenPage = {
  slug: string;
  path: string;
  header: ContentPageHeader;
  tags: string[];
  sections: ContentPageSection[];
};

export type AboutSummaryCard = {
  title: string;
  items: string[];
};

export type AboutPageContent = ContentPageHeader & {
  name: string;
  tags: string[];
  aboutItems: string[];
  summaryCards: AboutSummaryCard[];
  workedOnItems: string[];
  interestItems: string[];
  linkedInHref?: string;
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  summary: string;
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};
