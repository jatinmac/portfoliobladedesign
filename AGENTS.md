# Repository Guidelines

## App Overview

This is a Next.js 15 App Router portfolio for Jatin Davis. It combines static pages, markdown case studies, Razorpay Blade as the app-wide design system, and a Groq retrieval chat assistant grounded in repository content.

## Codebase Analysis Snapshot

The application has four clear layers:

- **Presentation:** `src/app/` route files assemble page experiences, while reusable UI lives under `src/components/`. `src/app/layout.tsx` wraps the app with `StyledComponentsRegistry`, `BladeProviders`, and the app-wide `PortfolioAppShell`. Blade infrastructure is centralized in `src/components/blade/`: `BladeProviders.tsx`, `BladeMotionProvider.tsx`, `StyledComponentsRegistry.tsx`, `portfolio-theme.ts`, `blade-fonts.ts`, `framer-motion-features.js`, `razorSensePreload.ts`, and `PortfolioPrimitives.tsx`. `PortfolioPrimitives.tsx` is the controlled barrel for Blade components, icons, hooks, and types. `src/app/globals.css` sets the Blade Inter font stack (`'Inter', 'Inter Fallback Arial', Arial, sans-serif`) on `body` as a safety net so native HTML elements that are not wrapped in Blade components still render in the correct font. Most page-level UI is built with `Box`, `Text`, `Heading`, `Button`, `Badge`, `Link`, `List`, and RazorSense primitives; `ChatInput` and `ChatMessage` are chat-panel-specific primitives.
- **App shell and client state:** `src/components/PortfolioAppShell.tsx` is the outermost client shell. It renders the desktop sidebar, mobile top bar, mobile sidebar overlay, and main content region. It manages recent chat sessions in `sessionStorage`, keeps the active chat ID, handles sidebar navigation/new-chat behavior, and provides `PortfolioShellContext`. The exported `usePortfolioShell()` hook exposes `activeChatId` and `handleFirstUserMessage()` to descendants such as `ChatPanel`.
- **Portfolio content:** All author-editable portfolio knowledge lives in `content/`. `content/about.md`, `content/experience.md`, `content/contact.md`, `content/resume.md`, `content/projects.md`, `content/chat-config.yaml`, and `content/projects/*.md` are the single source of truth for AI-citable portfolio claims, page headers, RAG content, starter prompts, follow-ups, project metadata, project product links, and project media keys. `src/lib/content/types.ts` is the canonical content type source. `content-loader.ts` reads shared markdown/YAML and exposes domain helpers; `projects.ts` reads project markdown with `gray-matter`; `markdown.ts` parses project markdown blocks for structured rendering; `pages.ts` adapts content files into the page-content contract; and `site.ts` exposes site metadata, navigation, starter prompt, expertise, experience, contact, resume, page metadata, and follow-up helpers.
- **Chat and retrieval:** `src/app/api/chat/route.ts` validates requests, rejects cross-origin requests, rate-limits by hashed IP, checks `GROQ_API_KEY`, calls `runPortfolioAgent`, streams metadata first, then streams assistant text. `src/lib/chat/types.ts` defines chat domain types, `prompt.ts` prepares retrieval-backed prompts and metadata, `agent.ts` performs up to three read-only Groq tool-planning steps through `tools.ts`, and `validation.ts` guards request payloads. Retrieval types live in `src/lib/rag/types.ts`; `retriever.ts` coordinates retrieval; `supabase-retriever.ts` provides Supabase hybrid retrieval; `chunks.ts` builds checked-in lexical chunks; `embeddings.ts` uses `@xenova/transformers` for local embeddings; and `indexing.ts` writes chunks into Supabase.

The current architecture is strongest when UI changes stay inside the presentation layer, shell/sidebar/session changes stay inside `PortfolioAppShell.tsx` and `PortfolioSidebar.tsx`, Blade/provider changes stay inside `src/components/blade/`, chat behavior stays inside `src/components/ChatPanel.tsx`, API contract changes stay inside `src/app/api/chat/route.ts`, and retrieval, Groq, prompt, or content-loader changes stay inside `src/lib/chat/`, `src/lib/rag/`, `src/lib/groq/`, or `src/lib/content/` as appropriate.

## Project Structure & Module Organization

Use `src/app/` for App Router pages, metadata routes, and API routes. Key entry points are `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/api/chat/route.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts`. Static routes are `/about`, `/experience`, `/contact`, `/resume`, and `/projects`; project detail routes are `/projects/[slug]`, with `src/app/projects/[slug]/loading.tsx` rendering `ProjectPageLoading`.

Put reusable UI in `src/components/`, app shell state in `src/components/PortfolioAppShell.tsx`, Blade infrastructure in `src/components/blade/`, shared page shells in `src/components/page-layouts/`, type declaration files in `src/types/`, chat logic in `src/lib/chat/`, retrieval in `src/lib/rag/`, Groq code in `src/lib/groq/`, Supabase client setup in `src/lib/supabase/`, the server analytics helper in `src/lib/analytics/`, shared environment helpers in `src/lib/env.ts`, and content loaders/types in `src/lib/content/`. The agentic chat loop lives in `src/lib/chat/agent.ts`, read-only portfolio tools live in `src/lib/chat/tools.ts`, prompt and metadata construction lives in `src/lib/chat/prompt.ts`, and static page content for retrieval is adapted through `src/lib/content/pages.ts`.

Notable components and helpers:

- `HomepageChatExperience.tsx`: homepage composition around portfolio-scoped `ChatPanel`.
- `ChatPanel.tsx`: chat state, streaming, storage, retry, stop, reset, metadata parsing, starter prompts, follow-ups, and composer states.
- `ChatMessageContent.tsx`: compact markdown rendering for chat answers and user messages.
- `MarkdownRenderer.tsx` and `MarkdownArticle.tsx`: constrained markdown rendering for static/project content.
- `PortfolioSidebar.tsx`: Blade sidebar navigation, projects, and recent-chat rows.
- `ProjectImageCarousel.tsx`: Blade `Carousel`/`CarouselItem` media for project pages with multiple images.
- `ProjectPageLoading.tsx`: project detail loading state using Blade `Spinner` and text.
- `ResumeHighlightsList.tsx`: resume bullet lists using Blade `List`/`ListItem`.

Root-level support directories and files:

- `scripts/`: TypeScript operational scripts run by `tsx`, currently `validate-content.ts` and `index-rag.ts`.
- `supabase/migrations/`: SQL migrations for the RAG database and improved fusion retrieval.
- `.codex/`: local agent/design reference material, including Figma/sidebar implementation references.
- `PRD.md`: product requirements context for larger product decisions.
- `next.config.mjs`: disables `X-Powered-By`, enables `compiler.styledComponents: true`, and sets `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options` headers.
- `src/app/globals.css`: intentionally minimal global CSS; do not expand it for component styling unless there is no Blade/theming alternative.

The `assets/` directory is organized by use:

- `assets/profile/`: profile images such as `jatin-davis.jpeg`.
- `assets/projects/`: project artwork and screenshots named with project-slug-aligned kebab-case, using numeric suffixes such as `double-ai-01.png` when a project has multiple images.

The `content/` directory is the authoring surface:

- `content/about.md`: profile/site metadata, about page copy, homepage chat heading, expertise tags, summary cards, worked-on items, and interests.
- `content/experience.md`: experience timeline/content.
- `content/contact.md`: contact channels.
- `content/resume.md`: resume highlights.
- `content/projects.md`: project index page title and description.
- `content/chat-config.yaml`: starter prompts and follow-up suggestions.
- `content/projects/*.md`: markdown case studies. Filenames must match the project `slug` as kebab-case, for example `double-ai.md`.
- `content/README.md`: authoring guide.

Store case studies in `content/projects/*.md`; each filename must match its `slug` as kebab-case and this is enforced by `npm run validate`. Each file needs `title`, `slug`, `summary`, `role`, and `timeline`. Optional frontmatter includes `order`, `tags`, `stack`, `platform`, `outcome`, `productUrl`, `heroImage`, `galleryImages`, and `chatContext`. Use numeric `order` frontmatter to control project display order instead of prefixing filenames with numbers. When `chatContext` is missing, RAG chunks auto-generate searchable context from the project title, summary, role, timeline, tags, stack, platform, outcome, product URL, and section headings.

Project artwork is imported statically in route/component files so Next.js can optimize local images, but the selected media is content-driven through `heroImage` and `galleryImages` filenames in project frontmatter. External product links are content-driven through `productUrl`. Keep AI-citable portfolio facts, links, page copy, and project evidence in `content/`; TypeScript should only map known asset filenames to static imports or render loaded content.

## Current UI Baseline

The repo has moved past the stripped reset state into a Blade-native UX baseline. Do not reintroduce the old sticky project chat sidebar, old static-page header/nav chrome, previous stage composition, or earlier chat visual treatment unless a new design explicitly calls for them. Keep the existing logic in place while improving the presentation layer: `PortfolioAppShell` owns shell/sidebar/recent-chat behavior, `ChatPanel` owns chat state and streaming behavior, `src/app/api/chat/route.ts` owns the API contract, `src/lib/chat/` owns prompt and validation behavior, `src/lib/rag/` owns retrieval, and `src/lib/content/` owns portfolio content.

New UI work should start from the current Blade surfaces:

- `/` renders `HomepageChatExperience` with portfolio-scoped `ChatPanel` inside the app-wide shell. Starter prompts come from `content/chat-config.yaml`, the empty-state heading comes from `content/about.md`, and project carousel media is selected from project frontmatter.
- `/about` renders structured profile/about sections from `content/about.md`.
- `/experience`, `/contact`, and `/resume` render content-backed page headers inside `PortfolioStaticPageExperience`; `/experience` reads timeline items from `content/experience.md`, `/contact` reads contact links from `content/contact.md`, and `/resume` uses `ResumeHighlightsList` with highlights from `content/resume.md`.
- `/projects` renders selected-work cards from `content/projects/*.md` with page copy from `content/projects.md` and artwork selected by project frontmatter.
- `/projects/[slug]` renders a pure markdown case-study layout with metadata, content-backed product links, hero media, `ProjectImageCarousel` when `galleryImages` is configured, and structured markdown sections. It does not render `ChatPanel`.
- `src/app/projects/[slug]/loading.tsx` renders the project detail loading boundary through `ProjectPageLoading`.
- `robots.ts` and `sitemap.ts` generate `robots.txt` and `sitemap.xml`; sitemap covers static and project routes.
- The `PortfolioSidebar` recent chat messages are fixed to the current Figma-derived Blade `ActionList` row design unless a future request explicitly changes them. Preserve direct `ActionListItem` children, 8px padding, 8px radius, left-aligned single-line text, ellipsis truncation, black text, selected-state behavior, and the existing `onSelectChat` routing/session behavior.
- `PortfolioAppShell` is a behavior-preservation boundary for `sessionStorage` recent chats, active chat ID, first-message registration, new-chat routing, selected-chat routing, and the mobile top bar/sidebar overlay.
- `ChatPanel` remains a behavior-preservation boundary. Its visible states can be refined, but keep starter prompts, follow-up actions, streaming behavior, storage, and scoped API behavior intact.
- The chat experience should show suggestions only for assistant metadata. Do not render a "Sources used" section in chat answers unless a new design explicitly reintroduces it.
- Starter and follow-up suggestions use Blade `Chip` and `ChipGroup`, are left-aligned, and stack with `gap="spacing.0"`. The chat suggestion chips use a scoped Blade theme override so their chip radius resolves to `1000`.
- User message text is rendered through `ChatMessageContent.tsx` with a Blade `Box` wrapper using `padding="spacing.2"` for 4px inner padding.

The next design pass should change layout and UI composition only unless the user explicitly asks for backend, retrieval, content, or Groq changes. If a UI change appears to require those layers, pause and document why before modifying them.

## Build, Test, and Development Commands

- `npm run dev`: start the Next.js dev server.
- `npm run build`: run `prebuild`, then create a production build.
- `npm run start`: start the production Next.js server after a build.
- `npm run lint`: run TypeScript with `tsc --noEmit`. There is no ESLint configuration in this project.
- `npm run typecheck`: run TypeScript with `tsc --noEmit`.
- `npm test`: run the Vitest suite.
- `npm run validate`: validate central content files, project frontmatter, YAML config, kebab-case slugs, slug-matched project filenames, numeric project `order`, and duplicate slugs.
- `npm run prebuild`: run the same content validation via `tsx scripts/validate-content.ts`; this runs automatically before `npm run build`.
- `npm run rag:index`: index all content-backed portfolio sources into Supabase RAG tables via `tsx scripts/index-rag.ts`.

## Coding Style & Naming Conventions

Write TypeScript React components with PascalCase filenames, for example `ChatPanel.tsx`. Use kebab-case for routes, markdown slugs, project markdown filenames, and asset filenames. Keep server-only code out of client imports. Build all UI with Razorpay Blade components and custom primitives in `src/components/blade/PortfolioPrimitives.tsx`; wire themes through `src/components/blade/BladeProviders.tsx` and `src/components/blade/portfolio-theme.ts`. Keep declaration-only files in `src/types/`.

Use relative imports. The project does not define a `@/` path alias in `tsconfig.json`, so do not introduce alias imports unless the config is explicitly changed.

Keep `src/app/globals.css` minimal. It currently sets `box-sizing`, resets `margin`/`padding`, and applies the Blade Inter font stack on `body` as a font-family safety net. Prefer Blade styled props, Blade tokens, provider/theme changes, or small component-level primitives over global CSS. Do not remove the `body` font-family declaration; it ensures native HTML elements (such as `<li>` in markdown rendering) inherit Blade fonts instead of browser defaults.

## Codex Blade Enforcement

Codex and any other coding agent must follow `BLADE_RULES.md` and `.cursor/rules/frontend-blade-rules.mdc` before adding, changing, reviewing, or explaining frontend UI. Treat those files as the source of truth for Blade usage in this repo. `package.json` declares `@razorpay/blade` as `^12.98.1`; the current `package-lock.json` resolves `@razorpay/blade` to `12.98.1`. `src/components/blade/PortfolioPrimitives.tsx` is the approved import surface for Blade components, icons, hooks, and types.

Required Blade workflow for frontend UI work:

- Read `BLADE_RULES.md` first, then check `.cursor/rules/frontend-blade-rules.mdc` for Blade MCP, styled-prop, responsive layout, and metric-reporting expectations.
- Use the Blade MCP server before writing UI code or answering Blade implementation questions. Fetch component docs for specific components, pattern docs for page-level layouts or known Blade patterns, and general docs for setup, theming, icons, tokens, or usage.
- Prefer Blade components over raw HTML and custom CSS. Do not introduce competing component libraries, inline styles, CSS Modules, Tailwind utilities, hardcoded color values, or raw form/table/navigation elements when a Blade equivalent exists.
- Import Blade UI through `src/components/blade/PortfolioPrimitives.tsx`. Do not import directly from `@razorpay/blade/components` except inside the project barrel or provider/type infrastructure. If a Blade export is missing, add the specific export to the barrel.
- Use `Box` and Blade styled props for layout with tokenized spacing, colors, radius, elevation, and typography. Use mobile-first responsive object syntax such as `{ base: '...', m: '...' }`.
- Keep native HTML only when Blade has no equivalent or when semantics require it, such as `form`, `img`, `picture`, `source`, `canvas`, `video`, `audio`, and markdown-rendered content. Document why the native/custom element is needed. When native HTML elements render user-visible text (e.g. `<li>` in `MarkdownRenderer.tsx`), wrap the text content in a Blade `Text` component so it receives proper Blade typography tokens (font, size, weight, line-height, color) rather than relying solely on CSS inheritance from the `body` font-family safety net.
- If Blade MCP metric tooling is available after code edits, publish the aggregate lines-added/removed metric exactly once before the final summary.

The Blade MCP server is available in this workspace. Use `get_blade_component_docs` for component props, `get_blade_pattern_docs` for larger layouts, `get_blade_general_docs` for usage/theming/icons, `get_blade_changelog` for Blade version questions, and `get_figma_to_code` only when converting a Figma node to Blade code.

## Testing Guidelines

Use Vitest for unit and integration coverage. `vitest.config.ts` uses the `node` environment and currently includes only `src/**/*.test.ts`; use co-located `*.test.ts` files unless the config is updated to include TSX tests. Existing tests are co-located with source modules, including chat agent/prompt/tools/validation tests, Groq client tests, content loader/project/markdown tests, and RAG chunks/retriever/Supabase/indexing tests.

Prioritize chat route validation, agent tool dispatch, Groq streaming and tool-call request formation, retrieval ranking, prompts, content loading, markdown parsing/rendering, content validation, auto-generated project chat context, `sessionStorage` chat persistence by scope, and orchestrator scope. `content-loader.ts` exports `resetContentLoaderCacheForTests()` for tests that need fresh content reads. Run `npm run validate` and `npm test` before a pull request.

## Content Loader Surface

`src/lib/content/content-loader.ts` exposes `getAllContentPages()`, `getContentPage()`, `getProfilePage()`, `getContentPageHeader()`, `getContentPageSectionTitle()`, `getSiteMetadataContent()`, `getChatConfig()`, `getExpertiseChips()`, `getHomeHeadline()`, `getAboutPageContent()`, `getExperienceItems()`, `getContactLinks()`, `getResumeHighlights()`, `shouldBypassContentCache()`, and `resetContentLoaderCacheForTests()`. In development and tests, `shouldBypassContentCache()` returns true when `NODE_ENV !== 'production'`, so page and chat config caches are bypassed and content edits are picked up without a restart.

`src/lib/content/site.ts` exports `siteMetadata`, `navigationItems`, `starterPrompts`, `expertiseChips`, `experienceItems`, `contactLinks`, `resumeHighlights`, `buildPageMetadata()`, `getStarterPrompts()`, `getFollowUpConfig()`, and `getSiteMetadata()`.

`src/lib/content/markdown.ts` provides `parseMarkdownBlocks()` and `stripInlineMarkdown()` for project detail rendering. Keep markdown parsing centralized there instead of creating route-local parsers.

## Chat, Retrieval & Analytics Notes

`src/app/api/chat/route.ts` must validate input, reject cross-origin requests, rate-limit by hashed IP, check `GROQ_API_KEY`, call `runPortfolioAgent`, and stream metadata before assistant text. The app exports a Next.js `Viewport` config from `layout.tsx` and uses metadata helpers from content for route SEO.

The agent may run up to three read-only Groq tool-calling planning steps before the final streamed answer. `src/lib/chat/prompt.ts` owns `preparePortfolioChat()`, `buildPortfolioAnswerSystemPrompt()`, `buildMetadata()`, `classifyIntent()`, `decomposeMultiPartQuery()`, `rewriteQueryForRetrieval()`, token-budget handling, source references, and follow-up selection. `src/lib/chat/types.ts` defines `ChatMessage`, `ChatRequestPayload`, `ChatIntent`, `AgentStep`, `AssistantMetadata`, and `PreparedChat`.

Tools must stay grounded in checked-in content from `content/` and the existing retriever; do not add external search or mutation tools. Project chat stays scoped unless the user asks to compare or broaden. Supabase Postgres + pgvector is the preferred RAG store when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured; `src/lib/supabase/server.ts` provides `createSupabaseServiceClient()` and `hasSupabaseRagConfig()`. Lexical retrieval remains the fallback when Supabase is missing, empty, or unavailable. In development, content and lexical chunk loaders bypass caches so edits in `content/` are picked up without a restart; production keeps caches for performance. Keep Groq unchanged as the answer-generation provider. The only analytics helper left in the repo is the server-side IP hashing utility used for rate limiting.

Every AI-citable claim should trace back to a file in `content/`. Do not add new portfolio facts, bio copy, resume claims, contact details, starter prompts, follow-ups, or project evidence as hardcoded strings in TypeScript. Add or edit markdown/YAML in `content/`, then let the loaders, RAG chunks, and chat tools consume it.

## Dependency Notes

Important pinned or integration-sensitive dependencies:

- `@razorpay/blade`: declared as `^12.98.1`, currently locked to `12.98.1`.
- `styled-components`: pinned to `5.3.11`; Blade provider/SSR infrastructure depends on the styled-components setup and `next.config.mjs` compiler flag.
- `framer-motion`: pinned to `11.13.3`; Blade motion infrastructure uses the local lazy feature bundle.
- `@razorpay/i18nify-js` and `@razorpay/i18nify-react`: Blade peer/integration dependencies.
- `@xenova/transformers`: local embedding generation for RAG.
- `tsx`: runs TypeScript scripts in `scripts/`.

## Commit & Pull Request Guidelines

No Git history is available in this workspace, so use short imperative commits such as `Add project chat retrieval` or `Rebuild portfolio homepage layout`. Pull requests should include a concise description, test results, linked issue, and screenshots or recordings for visual UI changes.

## Security & Configuration Tips

Do not commit secrets or local environment files. Document keys in `.env.example`, including `NEXT_PUBLIC_SITE_URL`, `GROQ_API_KEY`, `GROQ_BASE_URL`, `GROQ_MODEL`, `GROQ_MAX_INPUT_TOKENS`, `GROQ_MAX_TOKENS`, `GROQ_TEMPERATURE`, `GROQ_REASONING_EFFORT`, `GROQ_RETRY_COUNT`, `GROQ_RETRY_BACKOFF_MS`, `GROQ_TIMEOUT_MS`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAG_EMBEDDING_MODEL`, and `RAG_MATCH_THRESHOLD`. Keep build output, local TypeScript cache artifacts, and secret-bearing environment files out of source control.

Security-related infrastructure currently lives in `next.config.mjs`: `poweredByHeader: false`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Frame-Options: DENY`.
