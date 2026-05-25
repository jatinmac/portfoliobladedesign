# Repository Guidelines

## App Overview

This is a Next.js 15 App Router portfolio for Jatin Davis. It combines static pages, markdown case studies, Razorpay Blade as the app-wide design system, and a Groq retrieval chat assistant grounded in repository content.

## Codebase Analysis Snapshot

The application has four clear layers:

- **Presentation:** `src/app/` route files assemble page experiences, while reusable UI lives under `src/components/`. `src/app/layout.tsx` wraps the app with `StyledComponentsRegistry`, `BladeProviders`, and the app-wide `PortfolioAppShell`. Blade infrastructure is centralized in `src/components/blade/`: `BladeProviders.tsx`, `BladeMotionProvider.tsx`, `StyledComponentsRegistry.tsx`, `portfolio-theme.ts`, `blade-fonts.ts`, `framer-motion-features.js`, `razorSensePreload.ts`, and `PortfolioPrimitives.tsx`. `PortfolioPrimitives.tsx` is the controlled barrel for Blade components, icons, hooks, and types. `src/app/globals.css` sets the Blade Inter font stack (`'Inter', 'Inter Fallback Arial', Arial, sans-serif`) on `body` as a safety net so native HTML elements that are not wrapped in Blade components still render in the correct font. Page-level UI is built with Blade `Box`, `Text`, `Heading`, `Button`, `Badge`, `Link`, `List`, carousel, motion, RazorSense, `ChatInput`, and `ChatMessage` primitives. Shared motion helpers live in `PageTransition.tsx` (which is a simplified pass-through for performance), `ScrollReveal.tsx`, and `StaggeredEntrance.tsx`.
- **App shell and client state:** `src/components/PortfolioAppShell.tsx` is the outermost client shell. `src/app/layout.tsx` passes it the navigation items, project summaries, placeholder suggestions, and homepage chat heading so the persistent chat column can be rendered outside individual route pages. The shell renders the desktop sidebar, mobile top bar (showing the active section title dynamically), mobile sidebar overlay (positioned via simple CSS flex/none layout rather than Framer Motion), mobile chat overlay for split-workspace routes, scroll progress indicator (`ScrollProgressBar.tsx`), and the split workspace for portfolio pages. In the split workspace, the routed page content renders on the left and the persistent portfolio AI chat renders on the right. It manages recent chat sessions in `sessionStorage`, keeps the active chat ID, handles sidebar navigation/new-chat behavior, closes mobile sidebar/chat overlays on route or chat-session changes, and provides `PortfolioShellContext`. The exported `usePortfolioShell()` hook exposes `activeChatId` and `handleFirstUserMessage()` to descendants such as `ChatPanel`.
- **Portfolio content:** All author-editable portfolio knowledge lives in `content/`. Root markdown pages are discovered by `page` frontmatter rather than by filename, so the current source files include `content/about.md`, `content/Contact.md`, `content/Work Experience.md`, `content/projects.md`, `content/chat-config.yaml`, and `content/projects/*.md`. These files are the single source of truth for AI-citable portfolio claims, page headers, RAG content, starter prompts, follow-ups, project metadata, project product links, and project media keys. Current content intentionally uses a sharper, self-aware portfolio voice while keeping factual claims grounded in checked-in evidence. Resume highlights currently come from the `## Resume` section in `content/Work Experience.md`; the PDF download is served from `assets/profile/Jatin Davis Resume JDR .pdf` through `/resume-download`. `src/lib/content/types.ts` is the canonical content type source. `content-loader.ts` reads shared markdown/YAML and exposes domain helpers; `projects.ts` reads project markdown with `gray-matter`; `markdown.ts` parses project markdown blocks for structured rendering; `pages.ts` adapts content files into the page-content contract; and `site.ts` exposes site metadata, navigation, placeholder suggestions, expertise, experience, contact, resume-highlight, page metadata, and follow-up helpers.
- **Chat and retrieval:** `src/app/api/chat/route.ts` validates requests, rejects cross-origin requests, rate-limits by hashed IP, checks `GROQ_API_KEY`, calls `runPortfolioAgent`, streams metadata first, then streams assistant text. `src/lib/chat/types.ts` defines chat domain types, `prompt.ts` prepares retrieval-backed prompts and metadata, `agent.ts` performs up to three read-only Groq tool-planning steps through `tools.ts`, and `validation.ts` guards request payloads. The system prompt asks the assistant to sound professional, high-agency, collaborative, and evidence-based, with light self-aware wit allowed only when it does not outrun factual accuracy or professional evaluation. Retrieval types live in `src/lib/rag/types.ts`; `retriever.ts` runs the in-process lexical retriever over checked-in content chunks utilizing `searchableChunkCache` `WeakMap` query caching and optimized Set checks for speed; and `chunks.ts` builds project and site chunks from `content/`.

The current architecture is strongest when UI changes stay inside the presentation layer, shell/sidebar/session changes stay inside `PortfolioAppShell.tsx` and `PortfolioSidebar.tsx`, Blade/provider changes stay inside `src/components/blade/`, chat behavior stays inside `src/components/ChatPanel.tsx`, API contract changes stay inside `src/app/api/chat/route.ts`, and retrieval, Groq, prompt, or content-loader changes stay inside `src/lib/chat/`, `src/lib/rag/`, `src/lib/groq/`, or `src/lib/content/` as appropriate.

## Project Structure & Module Organization

Use `src/app/` for App Router pages, metadata routes, and API routes. Key entry points are `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/[slug]/page.tsx`, `src/app/api/chat/route.ts`, `src/app/resume-download/route.ts`, `src/app/robots.ts`, and `src/app/sitemap.ts`. Static content routes are driven by content-page `page` frontmatter. Custom page routes are `/about`, `/experience`, `/contact`, and `/projects`; additional content pages are rendered through `src/app/[slug]/page.tsx` unless the slug is listed in `CUSTOM_PAGE_SLUGS`. Project detail routes are `/projects/[slug]`, with `src/app/projects/[slug]/loading.tsx` rendering `ProjectPageLoading`. There is no standalone `/resume` page in the current app; use `/resume-download` for the PDF and the `## Resume` section in `content/Work Experience.md` for resume chat evidence.

Put reusable UI in `src/components/`, app shell state in `src/components/PortfolioAppShell.tsx`, Blade infrastructure in `src/components/blade/`, shared page shells in `src/components/page-layouts/`, type declaration files in `src/types/`, chat logic in `src/lib/chat/`, lexical retrieval in `src/lib/rag/`, Groq code in `src/lib/groq/`, the server analytics helper in `src/lib/analytics/`, shared environment helpers in `src/lib/env.ts`, and content loaders/types in `src/lib/content/`. The agentic chat loop lives in `src/lib/chat/agent.ts`, read-only portfolio tools live in `src/lib/chat/tools.ts`, prompt and metadata construction lives in `src/lib/chat/prompt.ts`, and static page content for retrieval is adapted through `src/lib/content/pages.ts`.

Notable components and helpers:

- `AboutPageExperience.tsx`: shared About page composition used by both `/` and `/about`, including `assets/profile/about.png`, LinkedIn action, content-backed tags/sections, and `AboutVisualSections`.
- `HomepageChatExperience.tsx`: persistent chat composition around portfolio-scoped `ChatPanel`, used in the desktop right column and in the mobile full-screen chat overlay for split-workspace routes. It delegates the empty-state carousel to the lazy-loaded `HomepageProjectCarousel.tsx`.
- `HomepageProjectCarousel.tsx`: lazy-loaded client component (`ssr: false`) that imports and displays project thumbnail cards in a carousel, isolating the image resolver map from the homepage bundles.
- `ScrollProgressBar.tsx`: Framer Motion based page scrolling progress indicator displayed fixed at the top of non-homepage routes.
- `AboutVisualSections.tsx`: visual sections renderer for `/about` that displays Thinking Flow, Process Timelines, Resources Grid, and Product highlights cards.
- `ChatPanel.tsx`: chat state, streaming, storage, retry, stop, reset, metadata parsing, starter prompts, follow-ups, and composer states. Uses Framer Motion layout animations for composer and empty-state exit transitions.
- `ChatMessageContent.tsx`: compact markdown rendering for chat answers and user messages. Assistant messages render through `MarkdownRenderer`; user messages stay plain text inside a small Blade `Box`.
- `MarkdownRenderer.tsx`: constrained markdown rendering for chat answers and project content. It supports headings, paragraphs, lists, markdown tables, inline links, inline code, bold emphasis, and semantic italic emphasis using Blade components where Blade equivalents exist. `MarkdownArticle.tsx` is only a thin wrapper around `MarkdownRenderer`.
- `PortfolioSidebar.tsx`: Blade sidebar navigation, projects, and recent-chat rows. Persists collapsed state in `localStorage` and highlights the active route.
- `ContentDrivenPageExperience.tsx`: generic Blade page renderer for frontmatter-backed content pages, featuring custom list card layout and text blocks supporting `feature` and `compact` visual modes.
- `ProjectImageCarousel.tsx`: Blade `Carousel`/`CarouselItem` media for project pages with multiple images.
- `PageTransition.tsx`, `ScrollReveal.tsx`, and `StaggeredEntrance.tsx`: Framer Motion helpers that respect `useReducedMotion()`. `PageTransition.tsx` is simplified to return raw children.
- `ProjectPageLoading.tsx`: project detail loading state using Blade `Spinner` and a short branded loading message.
- `AboutDetailList.tsx`, `MarkdownArticle.tsx`, `PortfolioStaticPageExperience.tsx`, and `ResumeHighlightsList.tsx`: retained helper/wrapper components from earlier page compositions. Current routes primarily use `ContentDrivenPageExperience`; do not expand the older helpers unless a new design explicitly brings them back.

Root-level support directories and files:

- `scripts/`: TypeScript operational scripts run by `tsx`, currently `validate-content.ts`.
- `.codex/`: local agent/design reference material, including Figma/sidebar implementation references.
- `PRD.md`: product requirements context for larger product decisions.
- `next.config.mjs`: disables `X-Powered-By`, enables `compiler.styledComponents: true`, sets security headers, enables `@next/bundle-analyzer` and configures `webpack` sideEffects settings for `@razorpay/blade` tree shaking.
- `src/app/globals.css`: minimal global CSS that sets the Blade Inter font stack on `body`, sets viewport behavior, and configures custom theme-adaptive scrollbars.

The `assets/` directory is organized by use:

- `assets/profile/`: profile images and downloadable resume assets such as `about.png`, `background.png`, `chat_experience_intro.png`, `jatin-davis.jpeg`, and `Jatin Davis Resume JDR .pdf`.
- `assets/projects/`: project artwork and screenshots named with project-slug-aligned kebab-case, using numeric suffixes such as `double-ai-01.png` when a project has multiple images. Pitch deck snapshots for Double.ai live under `assets/projects/DoubleAipitchdeck/` and are referenced by relative filenames in project frontmatter.

Many current profile and project PNG assets have been size-optimized to reduce the portfolio bundle and image payloads. Preserve those optimized replacements unless a design change requires new source media.

The `content/` directory is the authoring surface:

- `content/about.md`: profile/site metadata, about page copy, homepage chat heading, expertise tags, summary cards, worked-on items, and interests.
- `content/Work Experience.md`: the `experience` page source, experience timeline/content, and the `## Resume` highlight section consumed by chat/helpers.
- `content/Contact.md`: the `contact` page source, contact channels, and the resume-download link.
- `content/projects.md`: project index page title and description.
- `content/chat-config.yaml`: starter prompts and follow-up suggestions.
- `content/projects/*.md`: markdown case studies. Filenames must match the project `slug` as kebab-case, for example `double-ai.md`.
- `content/README.md`: authoring guide.

Root content pages must include `page` frontmatter with a safe kebab-case slug. Optional `navLabel`, `navOrder`, `order`, `sectionTitle`, `description`, and `tags` frontmatter influence navigation, page headers, and generic page rendering. Because filename is not the slug source for root content pages, preserve the existing filenames unless a content migration explicitly renames them and validates the result.

Store case studies in `content/projects/*.md`; each filename must match its `slug` as kebab-case and this is enforced by `npm run validate`. Each file needs `title`, `slug`, `summary`, `role`, and `timeline`. Optional frontmatter includes `order`, `tags`, `stack`, `platform`, `outcome`, `productUrl`, `heroImage`, `galleryImages`, `pitchDeckImages`, and `chatContext`. Use numeric `order` frontmatter to control project display order instead of prefixing filenames with numbers. When `chatContext` is missing, RAG chunks auto-generate searchable context from the project title, summary, role, timeline, tags, stack, platform, outcome, product URL, and section headings.

Project artwork is resolved through `src/lib/content/project-hero-images.ts` and `src/lib/content/project-images.ts` so Next.js can optimize local images while keeping selected media content-driven through `heroImage`, `galleryImages`, and `pitchDeckImages` filenames in project frontmatter. Add new local project media to those resolver maps when adding frontmatter references. External product links are content-driven through `productUrl`. Keep AI-citable portfolio facts, links, page copy, and project evidence in `content/`; TypeScript should only map known asset filenames to static imports or render loaded content.

## Current UI Baseline

The repo has moved past the stripped reset state into a Blade-native UX baseline. Do not reintroduce the old sticky project chat sidebar, old static-page header/nav chrome, previous stage composition, or earlier chat visual treatment unless a new design explicitly calls for them. Keep the existing logic in place while improving the presentation layer: `PortfolioAppShell` owns shell/sidebar/recent-chat behavior, `ChatPanel` owns chat state and streaming behavior, `src/app/api/chat/route.ts` owns the API contract, `src/lib/chat/` owns prompt and validation behavior, `src/lib/rag/` owns retrieval, and `src/lib/content/` owns portfolio content.

New UI work should start from the current Blade surfaces:

- `/` renders the split workspace with `AboutPageExperience` opened by default in the left pane and `HomepageChatExperience` in the right pane. The sidebar Pages list does not include a `Home` tab; `/` is treated as the About surface for page title and active sidebar highlighting.
- `/about` renders the same shared `AboutPageExperience` used by `/`, with structured profile/about content from `content/about.md`, a LinkedIn action when available, and `assets/profile/about.png` as the hero image. It filters visual sections (`'How I Think'`, `'Product Design Problem Solving Process'`, `'My Resources'`, and `'Best Products'`) and renders them using the structured graphical panels in `AboutVisualSections`.
- `/experience`, `/contact`, `/projects`, and project detail routes (`/projects/[slug]`) render in the left pane of the split workspace, with the persistent portfolio AI chat on the right for desktop and behind the mobile chat toggle on small screens.
- `/experience` renders `ContentDrivenPageExperience` from the `experience` content page in `content/Work Experience.md`.
- `/contact` renders `ContentDrivenPageExperience` from `content/Contact.md`, then replaces the parsed sections with custom contact action rows. Resume contact items route to `/resume-download`.
- `/resume-download` reads `assets/profile/Jatin Davis Resume JDR .pdf` on the Node.js runtime and returns it as an attachment. Keep path traversal protection intact if this route changes.
- `/projects` renders selected-work cards from `content/projects/*.md` in a responsive 2-column Grid (`repeat(2, minmax(0, 1fr))`) with page copy from `content/projects.md` and hero artwork resolved through `resolveProjectHeroImage()`. Cards showcase Platform and Outcome signals in custom panels and support tag badges.
- `/projects/[slug]` renders a pure markdown case-study layout with metadata, content-backed product links, hero media, `ProjectImageCarousel` when `galleryImages` is configured, a `Pitch Deck` carousel when `pitchDeckImages` is configured, and structured markdown sections. It renders a `ProjectBreadcrumb` at the top, includes dividing lines, and maps paragraph and list blocks into visual grid cards. The route is now included in the app shell split workspace, so keep case-study content focused in the left pane and let `PortfolioAppShell` provide the chat surface.
- `src/app/[slug]/page.tsx` statically renders any additional root content page not handled by a custom page route. Add new simple pages through content plus this generic renderer before creating bespoke routes.
- `src/app/projects/[slug]/loading.tsx` renders the project detail loading boundary through `ProjectPageLoading`, currently with the "Retrieving case study..." loading copy.
- `robots.ts` and `sitemap.ts` generate `robots.txt` and `sitemap.xml`; sitemap uses `getNavigationItems()` plus project routes.
- The `PortfolioSidebar` recent chat messages use direct `ActionList`/`ActionListItem` children and the existing `onSelectChat` routing/session behavior. The sidebar also owns collapsed/open desktop behavior (persisted under `portfolio-sidebar-collapsed` in `localStorage`), the mobile close variant, top projects, pages filtered to exclude `/resume`, and active path highlighting via `usePathname()`. Do not add a separate `Home` tab to the Pages list; `/` should highlight the `About` row.
- `PortfolioAppShell` is a behavior-preservation boundary for `sessionStorage` recent chats, active chat ID, first-message registration, new-chat routing, selected-chat routing, the mobile top bar (displaying dynamic page titles via `getPageTitle()`), mobile sidebar layout (flex display toggled directly rather than using Framer Motion animations), mobile chat overlay layout, split workspace routing for `/`, `/about`, `/experience`, `/contact`, `/projects`, and `/projects/[slug]`, and scrolling progress monitoring through `ScrollProgressBar` on non-homepage pages. On mobile split-workspace routes, the top bar shows a chat icon button that opens the full-screen `HomepageChatExperience` overlay and a close icon inside that overlay; hide the desktop chat column at the base breakpoint. The desktop split currently keeps the right chat column capped at `500px` on `l` and `520px` on `xl`; do not widen that baseline unless a new design explicitly asks for it.
- `ChatPanel` remains a behavior-preservation boundary. It uses Framer Motion `LayoutGroup` and `AnimatePresence` to coordinate shared layout transitions on the composer (`layoutId="portfolio-chat-composer"`) and empty-state exit animations.
- `ChatPanel` also owns the profile-card empty state, animated placeholder suggestions (utilizing robust recursive `setTimeout` reveals), Tab-to-accept placeholder behavior, retry/stop controls, response animation, and `sessionStorage` transcript persistence.
- `ChatInput` event handlers in `ChatPanel` must defensively normalize payloads before updating state or submitting. Blade documents `onChange`/`onSubmit` as value-shaped payloads, but browser/event-shaped payloads can still surface through interaction paths. Always extract a string from `payload.value`, `target.value`, or `currentTarget.value`, fall back to the current draft, and call `preventDefault()` when present. Do not pass raw handler payloads into `sendMessage`, or the UI can submit/render `[object Event]`.
- Streamed assistant message updates in `ChatPanel` should remain idempotent. Keep `updateAssistantMessage` stable with `useCallback`, avoid setting state when content and metadata are unchanged, and avoid per-chunk state writes before either metadata or assistant text exists. This prevents maximum update depth loops during streaming.
- The chat experience should show suggestions only for assistant metadata. Do not render a "Sources used" section in chat answers unless a new design explicitly reintroduces it.
- Starter and follow-up suggestions use Blade `Chip` and `ChipGroup`, are left-aligned, and stack with `gap="spacing.0"`. The current starter prompts and follow-ups are content-driven from `content/chat-config.yaml` and use more specific, conversational prompts about Double.ai, Maruti Suzuki, resume access, design tradeoffs, design-system adoption, and engineer collaboration. The chat suggestion chips use a scoped Blade theme override so their chip radius resolves to `1000`.
- User message text is rendered through `ChatMessageContent.tsx` with a Blade `Box` wrapper using `padding="spacing.2"` for 4px inner padding.
- Assistant message text must remain human-readable and structured. Keep `ChatMessageContent.tsx` routing assistant answers through `MarkdownRenderer` after streaming completes, and do not replace it with raw `whiteSpace="pre-wrap"` output except during the active streaming state.
- Markdown tables in assistant answers and project markdown must render as a static Blade `Box` grid with horizontal overflow support, not as raw pipe-delimited text. Do not use Blade `Table` inside chat markdown rendering because its internal state can conflict with streamed chat message updates. Inline markdown should preserve useful hierarchy: `**bold**` maps to semibold Blade `Text`, inline code maps to Blade `Code`, safe links map to Blade `Link`, and `*italic*` is kept as semantic emphasis.
- Keep `src/lib/content/markdown.ts` as the shared parser for markdown blocks. When adding markdown syntax support, update `MarkdownRenderer.tsx`, project-page rendering, and `src/lib/content/markdown.test.ts` together so chat and project pages do not diverge.
- Use `ContentDrivenPageExperience` for content-backed page layouts. It centers contents at a max-width of `900px` and replaces standard browser lists and paragraph margins with structured visual cards supporting `feature` and `compact` modes. It supports parsed `##` sections, `###` subsections, dividing lines, optional header actions, and scroll/stagger reveals.

The next design pass should change layout and UI composition only unless the user explicitly asks for backend, retrieval, content, or Groq changes. If a UI change appears to require those layers, pause and document why before modifying them.

## Build, Test, and Development Commands

- `npm run dev`: start the Next.js dev server.
- `npm run build`: run `prebuild`, then create a production build.
- `npm run start`: start the production Next.js server after a build.
- `npm run lint`: run TypeScript with `tsc --noEmit`. There is no ESLint configuration in this project.
- `npm run typecheck`: run TypeScript with `tsc --noEmit`.
- `npm test`: run the Vitest suite.
- `npm run validate`: validate root content page frontmatter, duplicate page slugs, project frontmatter, YAML config, kebab-case project slugs, slug-matched project filenames, numeric project `order`, and duplicate project slugs.
- `npm run prebuild`: run the same content validation via `tsx scripts/validate-content.ts`; this runs automatically before `npm run build`.
- `ANALYZE=true npm run build`: run the production build with `@next/bundle-analyzer` enabled to inspect bundle size changes.

## Hosting & Deployment Notes

The GitHub repository for the deployed app is `https://github.com/jatinmac/portfoliobladedesign`. The production Vercel deployment is served from `https://jatindavis.vercel.app/` and deploys from the `main` branch.

Vercel production chat requires the Groq environment variables to be configured in the Vercel project settings. At minimum, set `GROQ_API_KEY` and `GROQ_MODEL`; `GROQ_BASE_URL` may be omitted because the code defaults to `https://api.groq.com/openai/v1`. When changing any Vercel environment variable, redeploy the production deployment because already-built serverless functions do not automatically pick up new values.

If `/api/chat` returns `503` in Vercel runtime logs and external calls to `api.groq.com/openai/v1/chat/completions` show `401`, treat it as a Groq secret-value problem first: re-copy the raw Groq key into Vercel without quotes, whitespace, or a `Bearer ` prefix, then redeploy. This exact issue was resolved by re-pasting the `GROQ_API_KEY` value in Vercel.

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

Use Vitest for unit and integration coverage. `vitest.config.ts` uses the `node` environment and currently includes only `src/**/*.test.ts`; use co-located `*.test.ts` files unless the config is updated to include TSX tests. Existing tests are co-located with source modules, including chat agent/prompt/tools/validation tests, Groq client tests, content loader/project/markdown tests, and RAG chunks/retriever tests.

Prioritize chat route validation, agent tool dispatch, Groq streaming and tool-call request formation, retrieval ranking, prompts, content loading, markdown parsing/rendering, content validation, auto-generated project chat context, `sessionStorage` chat persistence by scope, and orchestrator scope. `content-loader.ts` exports `resetContentLoaderCacheForTests()` for tests that need fresh content reads. Run `npm run validate` and `npm test` before a pull request.

## Content Loader Surface

`src/lib/content/content-loader.ts` exposes `getContentDirectory()`, `getContentPageSlugs()`, `getAllContentPages()`, `getContentPage()`, `getOptionalContentPage()`, `getContentNavigationItems()`, `getProfilePage()`, `getContentPageHeader()`, `getContentPageSectionTitle()`, `getContentDrivenPage()`, `getSiteMetadataContent()`, `getChatConfig()`, `getExpertiseChips()`, `getHomeHeadline()`, `getAboutPageContent()`, `getExperienceItems()`, `getContactLinks()`, `getResumeHighlights()`, `shouldBypassContentCache()`, and `resetContentLoaderCacheForTests()`. In development and tests, `shouldBypassContentCache()` returns true when `NODE_ENV !== 'production'`, so page and chat config caches are bypassed and content edits are picked up without a restart.

`src/lib/content/site.ts` exports `siteMetadata`, `navigationItems`, `expertiseChips`, `experienceItems`, `contactLinks`, `resumeHighlights`, `buildPageMetadata()`, `getNavigationItems()`, `getPlaceholderSuggestions()`, `getFollowUpConfig()`, and `getSiteMetadata()`.

`src/lib/content/markdown.ts` provides `parseMarkdownBlocks()` and `stripInlineMarkdown()` for structured rendering and retrieval/search text cleanup. `parseMarkdownBlocks()` intentionally preserves inline markdown for the React renderer while extracting block structure such as headings, lists, paragraphs, and tables. `stripInlineMarkdown()` is still used where plain searchable text is needed, such as RAG chunk construction. Keep markdown parsing centralized there instead of creating route-local parsers.

## Chat, Retrieval & Analytics Notes

`src/app/api/chat/route.ts` must validate input, reject cross-origin requests, rate-limit by hashed IP, check `GROQ_API_KEY`, call `runPortfolioAgent`, and stream metadata before assistant text. The app exports a Next.js `Viewport` config from `layout.tsx` and uses metadata helpers from content for route SEO.

The agent may run up to three read-only Groq tool-calling planning steps before the final streamed answer. `src/lib/chat/prompt.ts` owns `preparePortfolioChat()`, `buildPortfolioAnswerSystemPrompt()`, `buildMetadata()`, `classifyIntent()`, `decomposeMultiPartQuery()`, `rewriteQueryForRetrieval()`, token-budget handling, source references, and follow-up selection. `src/lib/chat/types.ts` defines `ChatMessage`, `ChatRequestPayload`, `ChatIntent`, `AgentStep`, `AssistantMetadata`, and `PreparedChat`.

Tools must stay grounded in checked-in content from `content/` and the existing retriever; do not add external search or mutation tools. Project chat stays scoped unless the user asks to compare or broaden. Retrieval is lexical-only and runs in-process over chunks built from checked-in markdown and YAML content. The retriever is optimized using `searchableChunkCache` `WeakMap` cached query/chunk stems and Set-based lookups during capping to minimize string transformation overhead. In development, content and lexical chunk loaders bypass caches so edits in `content/` are picked up without a restart; production keeps caches for performance. Keep Groq unchanged as the answer-generation provider. The only analytics helper left in the repo is the server-side IP hashing utility used for rate limiting.

Every AI-citable claim should trace back to a file in `content/`. Do not add new portfolio facts, bio copy, resume claims, contact details, starter prompts, follow-ups, or project evidence as hardcoded strings in TypeScript. Add or edit markdown/YAML in `content/`, then let the loaders, RAG chunks, and chat tools consume it.

## Dependency Notes

Important pinned or integration-sensitive dependencies:

- `@razorpay/blade`: declared as `^12.98.1`, currently locked to `12.98.1`.
- `styled-components`: pinned to `5.3.11`; Blade provider/SSR infrastructure depends on the styled-components setup and `next.config.mjs` compiler flag.
- `framer-motion`: pinned to `11.13.3`; Blade motion infrastructure uses the local lazy feature bundle.
- `@razorpay/i18nify-js` and `@razorpay/i18nify-react`: Blade peer/integration dependencies.
- `@next/bundle-analyzer`: integrated to measure package bundle footprints when running under `ANALYZE=true`.
- `tsx`: runs TypeScript scripts in `scripts/`.

## Commit & Pull Request Guidelines

No Git history is available in this workspace, so use short imperative commits such as `Add project chat retrieval` or `Rebuild portfolio homepage layout`. Pull requests should include a concise description, test results, linked issue, and screenshots or recordings for visual UI changes.

For smoother "send to GitHub" requests, use the GitHub CLI after confirming `gh auth status` reports `Logged in to github.com account jatinmac (keyring)` with `repo` and `workflow` scopes. The repo uses HTTPS git operations. From Codex, `gh` commands may need escalated execution so the CLI can access the macOS keyring and GitHub network APIs; if sandboxed `gh auth status` reports an invalid token but the user's terminal reports a valid keyring login, rerun the relevant `gh` command with sandbox escalation before treating auth as broken. A normal publish flow is: inspect `git status --short --branch`, run relevant checks, commit, `git push -u origin <branch>`, then create a draft PR with `gh pr create --draft --fill`.

## Security & Configuration Tips

Do not commit secrets or local environment files. Document keys in `.env.example`, including `NEXT_PUBLIC_SITE_URL`, `GROQ_API_KEY`, `GROQ_BASE_URL`, `GROQ_MODEL`, `GROQ_MAX_INPUT_TOKENS`, `GROQ_MAX_TOKENS`, `GROQ_TEMPERATURE`, `GROQ_REASONING_EFFORT`, `GROQ_RETRY_COUNT`, `GROQ_RETRY_BACKOFF_MS`, and `GROQ_TIMEOUT_MS`. Keep build output, local TypeScript cache artifacts, and secret-bearing environment files out of source control.

For hosted debugging, remember that the app only checks whether `GROQ_API_KEY` exists before calling Groq. A configured but incorrect key will pass the local presence check and then fail upstream with `401`, which the API maps to a `503` response for the client.

Security-related infrastructure currently lives in `next.config.mjs`: `poweredByHeader: false`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `X-Frame-Options: DENY`.
