import { getAllContentPages, getOptionalContentPage } from './content-loader';

export type PortfolioPage = string;

export type PortfolioPageContent = {
  page: PortfolioPage;
  title: string;
  path: string;
  content: string;
  sourcePath: string;
  frontmatter: Record<string, unknown>;
};

export function getPageContent(page: PortfolioPage): string {
  return getStructuredPageContent(page).content;
}

export function getStructuredPageContent(page: PortfolioPage): PortfolioPageContent {
  const match = getAllPageContent().find((item) => item.page === page);
  if (!match) {
    throw new Error(`Unknown portfolio page: ${page}`);
  }

  return match;
}

export function getAllPageContent(): PortfolioPageContent[] {
  const profile = getOptionalContentPage('about');
  const homePage = profile
    ? [
        {
          page: 'home',
          title: profile.title,
          path: '/',
          content: [profile.frontmatter.description, profile.body].filter(Boolean).join('\n\n'),
          sourcePath: profile.sourcePath,
          frontmatter: profile.frontmatter,
        },
      ]
    : [];

  return [
    ...homePage,
    ...getAllContentPages().map((page) => ({
      page: page.slug,
      title: page.title,
      path: page.path,
      content: page.body,
      sourcePath: page.sourcePath,
      frontmatter: page.frontmatter,
    })),
  ];
}
