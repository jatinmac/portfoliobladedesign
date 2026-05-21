import { describe, expect, it } from 'vitest';

import {
  getAllContentPages,
  getChatConfig,
  getContactLinks,
  getExperienceItems,
  getExpertiseChips,
  getResumeHighlights,
  getSiteMetadataContent,
} from './content-loader';

describe('central content loader', () => {
  it('loads editable markdown and YAML content from content/', () => {
    expect(getSiteMetadataContent()).toEqual(
      expect.objectContaining({
        name: 'Jatin Davis',
        title: 'Jatin Davis Portfolio',
      }),
    );
    expect(getAllContentPages().map((page) => page.slug)).toEqual([
      'about',
      'contact',
      'projects',
      'experience',
    ]);
    expect(getExpertiseChips()).toContain('Product builder');
    expect(getAllContentPages().find((page) => page.slug === 'experience')?.body).toContain(
      'Product Design Experience',
    );
    expect(getContactLinks()[0]).toEqual(
      expect.objectContaining({
        label: 'Email',
        href: 'mailto:jatindavis5@gmail.com',
      }),
    );
    expect(getContactLinks()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'YouTube',
          href: 'https://www.youtube.com/@formula1design/shorts',
        }),
      ]),
    );
    expect(getResumeHighlights()).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Architect turned product designer'),
      ]),
    );
    expect(getChatConfig().placeholderSuggestions).toContain("Ask about Jatin's resume?");
    expect(getChatConfig().followUps.project).toContain('What tradeoffs shaped this project?');
  });
});
