import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';

import './globals.css';
import { PortfolioAppShell } from '../components/PortfolioAppShell';
import { BladeProviders } from '../components/blade/BladeProviders';
import { getProjectSummaries } from '../lib/content/projects';
import { getHomeHeadline } from '../lib/content/content-loader';
import { getNavigationItems, getPlaceholderSuggestions, getSiteMetadata } from '../lib/content/site';
import { StyledComponentsRegistry } from '../components/blade/StyledComponentsRegistry';

const siteMetadata = getSiteMetadata();

export const metadata: Metadata = {
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  metadataBase: new URL(siteMetadata.siteUrl),
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const projects = getProjectSummaries();
  const pages = getNavigationItems();

  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <BladeProviders>
            <PortfolioAppShell
              projects={projects}
              pages={pages}
              placeholderSuggestions={getPlaceholderSuggestions()}
              emptyStateHeading={getHomeHeadline()}
            >
              {children}
            </PortfolioAppShell>
          </BladeProviders>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
