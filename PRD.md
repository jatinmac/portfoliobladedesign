# Product Requirements Document

# Repository-Grounded Portfolio Chat App

**Product:** Jatin Davis Portfolio  
**Version:** 1.1  
**Status:** UI reset baseline PRD  
**Last Updated:** April 26, 2026  
**Primary Stack:** Next.js App Router, React, TypeScript, Razorpay Blade, Groq, Supabase Postgres/pgvector RAG  

---

## 1. Executive Summary

The app is a product design portfolio with a repository-grounded AI chat assistant. The current implementation is intentionally in a UI reset baseline: the previous homepage sidebars, stage composition, static-page navigation chrome, sticky project chat sidebar, and previous chat visual treatment have been removed. A new Blade-based UI and layout, including a redesigned chat interface, can be designed without rewriting the chat, retrieval, content, or routing architecture.

Visitors can still browse static pages and markdown-backed case studies, or ask natural-language questions about the portfolio. The assistant answers from checked-in repository content, retrieves relevant case-study sections, streams responses, and cites supporting project sections inline.

The product is designed to help recruiters, hiring managers, and design peers quickly understand the designer's work, process, and case-study evidence without relying only on long-form static browsing.

## 2. Product Goals

| ID | Goal | Priority |
| --- | --- | --- |
| G1 | Provide a clean UI reset baseline that preserves conversational discovery while the new layout is designed. | P0 |
| G2 | Let visitors browse static portfolio sections for About, Experience, Projects, Contact, and Resume. | P0 |
| G3 | Render repository-backed project case studies from markdown content. | P0 |
| G4 | Provide portfolio-wide and project-scoped chat experiences that answer only from repository content. | P0 |
| G5 | Stream AI answers progressively with useful metadata, follow-ups, and inline evidence citations. | P0 |
| G6 | Preserve request safety, rate limiting, and clear API error handling without blocking the user experience. | P1 |
| G7 | Keep content maintenance simple through markdown files and typed content modules. | P1 |
| G8 | Rebuild the visual UI, including the chat interface, with Razorpay Blade only, without changing chat behavior, retrieval, Groq, or content architecture unless explicitly approved. | P0 |

## 3. Non-Goals

- No admin CMS or owner dashboard in the current implementation.
- No authentication or user accounts.
- No persistent server-side chat history.
- No public chat log viewer.
- No external database dependency for canonical public portfolio content; markdown and typed content remain the source of truth.
- No payment, booking, or hiring workflow.
- No general-purpose web search by the assistant.
- No full application rewrite for the redesign phase.
- No reintroduction of the removed sidebar/stage/static-page chrome unless required by the new design.
- No assumption that the current `ChatPanel` visual layout is final.
- No competing UI library, custom CSS framework, or non-Blade component system.

## 4. Target Users

### Recruiter

Needs a fast way to assess role fit, project relevance, and contact/resume information. Likely asks broad questions such as "What kind of design work does Jatin do?" or browses the resume/contact pages.

### Hiring Manager

Needs deeper evidence of product thinking, process, tradeoffs, and outcomes. Likely opens a case study and uses project-scoped chat to ask about decisions, constraints, and execution.

### Design Peer

Needs inspiration or a quick understanding of craft areas such as checkout UX, design systems, usability testing, and rollout planning.

## 5. Information Architecture

```text
/
├── portfolio-wide chat homepage
├── /about
├── /experience
├── /projects
├── /projects/[slug]
├── /contact
├── /resume
├── /api/chat
├── /robots.txt
└── /sitemap.xml
```

Primary content sources:

- `src/lib/content/site.ts`: site metadata, owner labels, navigation, expertise chips, experience timeline, contact links, resume highlights, and starter prompts.
- `content/projects/*.md`: markdown case studies with frontmatter and body content.
- `src/lib/rag/chunks.ts`: in-process lexical RAG chunks built from checked-in portfolio content.

Current UI baseline:

- `src/components/HomepageChatExperience.tsx`: minimal homepage shell that mounts portfolio-scoped `ChatPanel`.
- `src/components/ChatPanel.tsx`: retained chat state, streaming, retry, stop, reset, metadata parsing, and API behavior. The current rendering is only a minimal functional harness for the next chat UI redesign.
- `src/components/page-layouts/PortfolioStaticPageExperience.tsx`: minimal static-route shell that renders route-local content.
- `src/app/projects/[slug]/page.tsx`: single-column project page with project metadata, markdown body, and project-scoped `ChatPanel`.
- Removed or non-final UI: previous homepage left sidebar, previous homepage right sidebar assumptions, previous homepage stage component, old static-page navigation chrome, sticky project chat sidebar layout, old chat header, starter prompt buttons, message bubbles, metadata panel, follow-up buttons, loading treatment, and composer styling.

## 6. Core User Flows

### 6.1 Portfolio-Wide Chat Discovery

1. Visitor lands on `/`.
2. Homepage renders a minimal Blade shell with portfolio-scoped `ChatPanel`.
3. Visitor types a question.
4. Client stores the user turn, creates an empty assistant placeholder, and posts to `/api/chat`.
5. Server validates the request, rate limits by IP, retrieves relevant portfolio chunks from Supabase when configured, falls back to lexical retrieval when needed, builds a grounded prompt, and streams a Groq response.
6. Client renders the answer progressively and shows generated follow-up prompts.

### 6.2 Project Case Study Exploration

1. Visitor opens `/projects/[slug]`.
2. App loads the matching markdown case study.
3. Page renders project metadata, article content, and a project-scoped chat panel in one column.
4. Visitor asks a project-specific question.
5. Chat request includes `scope: "project"` and the active `projectSlug`.
6. Server retrieves only that project's chunks unless the user explicitly broadens scope.
7. Assistant answers from pinned project context and retrieved project sections.

### 6.3 Static Portfolio Browsing

1. Visitor opens `/about`, `/experience`, `/projects`, `/contact`, or `/resume`.
2. `PortfolioStaticPageExperience` renders a minimal shared shell.
3. Page body renders route-local content.

### 6.4 New Conversation

1. Visitor clicks New in `ChatPanel`.
2. Current portfolio or project chat state is reset.
3. The relevant `sessionStorage` entry is cleared.

## 7. Functional Requirements

### 7.1 Homepage

- Render the portfolio chat experience at `/`.
- Support stopping, retrying, and resetting chat.
- Keep the homepage free of the old sidebars and stage composition until a new design is specified.
- Preserve chat behavior while allowing the surrounding layout and chat interface to be redesigned.

### 7.2 Static Pages

- Provide `/about`, `/experience`, `/projects`, `/contact`, and `/resume`.
- Use a minimal shared static page shell until the new layout is designed.
- Keep content repository-owned and route-local where appropriate.
- Do not recreate previous shared navigation chrome without explicit design direction.

### 7.3 Project Pages

- Generate project routes from markdown slugs.
- Render markdown with frontmatter-driven metadata.
- Show role, timeline, summary, and full case-study body.
- Include a project-scoped `ChatPanel`.
- Keep project chat in the content flow rather than the removed sticky right sidebar until a new layout is specified.
- Return `notFound()` for invalid slugs.
- Generate metadata from project content.

### 7.4 Chat API

- Expose `POST /api/chat`.
- Require valid JSON payload.
- Allow only same-origin requests.
- Accept client messages with `user` and `assistant` roles only.
- Enforce max message count and max message length.
- Require `projectSlug` when `scope` is `project`.
- Rate-limit requests by client IP.
- Return clear JSON errors for validation, rate limit, missing API key, missing project, and upstream failures.
- Stream successful responses as `text/plain`.
- Prefix streamed text with a structured metadata preamble.

### 7.5 Retrieval And Grounding

- Load case studies from `content/projects`.
- Build retrieval chunks from project overview and markdown sections.
- Attach project metadata to every chunk.
- Rank chunks lexically by query tokens, phrases, section titles, content, metadata, and generated search text.
- Use lexical retrieval as the only RAG path; do not require an external vector database.
- Build site and project chunks directly from checked-in markdown/YAML content at runtime.
- Cap retrieved chunks per project for portfolio-wide questions when needed.
- Trim retrieved context to fit prompt token budget.
- Format retrieved context with project and section labels for citation.

### 7.6 LLM Response Generation

- Use Groq's OpenAI-compatible chat completions API.
- Stream assistant text to the client.
- Retry retryable upstream failures.
- Timeout long upstream requests.
- Use prompt policy that forbids unsupported claims.
- Require inline evidence citations for concrete claims when supported.
- Label inferences clearly.
- Avoid generic portfolio filler and unavailable biography/resume/contact claims.

### 7.7 Client Chat State

- Persist chat state in `sessionStorage`.
- Scope storage keys by portfolio/project context.
- Preserve partial assistant text if generation is stopped after visible output.
- Remove placeholder assistant message if generation is stopped before output.
- Support retrying the last submitted message.
- Keep client state local to the current browser session.
- Current rendering should stay minimal until the new visible chat UI is designed.

### 7.8 UI Reset And Redesign Constraints

- Treat the current UI as a stripped baseline, not the final visual design.
- Preserve existing application logic while rebuilding layout and component composition.
- Use Razorpay Blade components and the local `src/components/blade/PortfolioPrimitives.tsx` barrel for all UI changes.
- Redesign the chat UI as part of the visual system: message bubbles, empty state, starter prompts, composer, send/stop/retry/reset actions, streaming state, error state, metadata, and follow-up suggestions need new presentation.
- Do not modify `/api/chat`, Groq, retrieval, content loaders, markdown parsing, or prompt behavior for visual redesign work unless a concrete UI requirement cannot be met otherwise.
- Before implementing the new UI, define the target layout, visible components, removed components, responsive behavior, and acceptance criteria.
- Removed UI should remain removed unless the new design explicitly asks for an equivalent pattern.

## 8. Data Requirements

### Project Frontmatter

Each project markdown file must include:

```yaml
title: string
slug: string
summary: string
role: string
timeline: string
chatContext: string
```

### Chat Request

```ts
interface ChatRequestPayload {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  scope?: "portfolio" | "project";
  projectSlug?: string;
}
```

### Assistant Metadata

The streamed metadata should include:

- resolved scope
- intent classification
- retrieval mode
- conversation stage
- number of retrieved chunks
- number of projects represented
- source references
- follow-up suggestions
- token budget summary

## 9. Technical Architecture

### Frontend

- Next.js App Router
- React 18
- TypeScript
- Razorpay Blade component system
- styled-components registry for SSR compatibility
- Client components for chat interactions and new Blade layout shells

### Backend

- Next.js route handler at `/api/chat`
- Node.js runtime
- In-memory rate limiting
- Filesystem-backed content loading
- Groq streaming client
- Server-side IP hashing helper for rate limiting

### Retrieval

- Local markdown/frontmatter parsing
- Supabase Postgres + pgvector hybrid retriever
- Local lexical fallback retriever
- Local `Xenova/gte-small` 384-dimensional embeddings for indexing and query embedding

## 10. Environment Configuration

Required for chat:

```text
GROQ_API_KEY
```

Optional:

```text
GROQ_BASE_URL
GROQ_MODEL
GROQ_MAX_INPUT_TOKENS
GROQ_MAX_TOKENS
GROQ_TEMPERATURE
GROQ_REASONING_EFFORT
GROQ_RETRY_COUNT
GROQ_RETRY_BACKOFF_MS
GROQ_TIMEOUT_MS
NEXT_PUBLIC_SITE_URL
```

## 11. Non-Functional Requirements

### Performance

- Homepage and static pages should render without requiring chat API completion.
- Chat responses must stream progressively.
- Retrieval should prefer Supabase RAG when configured and remain deterministic through lexical fallback when it is not.
- Project catalog should be cached when possible.
- Prompt history and retrieved chunks must be trimmed to fit model limits.
- UI redesign work should not add avoidable client-side weight or duplicate existing chat/retrieval logic.

### Reliability

- Missing Groq configuration must return a clear `503` error.
- Retrieval should fall back to lexical mode if Supabase or vector search is unavailable.
- Groq failures should map to meaningful HTTP errors.

### Security

- Chat API must reject cross-origin requests.
- Payloads must be strictly validated.
- Project slugs must match safe lowercase kebab-case format.
- API keys must remain server-side.
- Rate limiting must hash client IP addresses before using them as limiter keys.

### Accessibility

- Chat inputs require accessible labels.
- Keyboard submission must support Enter to send and Shift+Enter for newline.
- The app should preserve semantic headings and main content regions.
- Any future mobile navigation or panel system must be keyboard accessible and dismissible.

## 12. Success Metrics

These are product metrics for future instrumentation and review. The current stripped baseline does not include a dedicated client analytics SDK.

Product metrics:

- Starter prompt click rate.
- Follow-up prompt click rate.
- Project page views.
- Conversation depth.
- New conversation starts.
- New layout task completion once the redesign is implemented.

Chat quality metrics:

- Chat response completion rate.
- Stream time to first byte.
- Total stream duration.
- Error rate by error type.
- Rate-limit frequency.
- Citation presence in responses.

Business outcome indicators:

- Contact page visits.
- Resume page visits.
- Return visits to project pages.
- Deep-dive project chat usage.

## 13. Testing Requirements

Existing and future tests should cover:

- Chat route validation and error handling.
- Rate limiting.
- Groq client streaming and SSE parsing.
- Prompt construction and token trimming.
- Content loading and frontmatter validation.
- Retrieval ranking, Supabase hybrid behavior, fallback behavior, content hashing, unchanged-chunk skip behavior, and chunk generation.
- Conversation context derivation.
- `sessionStorage` persistence by portfolio/project scope.
- UI reset constraints for homepage and project layouts where tests are practical.

Primary command:

```bash
npm test
```

## 14. Release Criteria

A release is acceptable when:

- `npm run build` passes.
- `npm test` passes.
- `npm run typecheck` passes.
- Chat works with a valid `GROQ_API_KEY`.
- Static pages render successfully.
- Project pages render from markdown content.
- Invalid project slugs return 404.
- Chat answers cite repository content when making concrete claims.
- Missing API key produces a clear user-facing error.
- The old homepage sidebars and sticky project right sidebar are not present unless intentionally reintroduced by the approved design.

## 15. Risks And Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| LLM invents unsupported portfolio claims. | Trust loss. | Strict prompt rules, repository-only retrieved context, citation requirement. |
| Groq API unavailable or slow. | Chat degradation. | Timeouts, retries, clear error states, static browsing remains available. |
| Markdown or typed portfolio content changes without RAG reindexing. | Supabase retrieval can serve stale chunks. | Content hashes, unchanged-chunk skip behavior, index runs, and lexical fallback. |
| In-memory rate limit resets between deployments. | Imperfect abuse protection. | Acceptable for current scope; move to durable store if abuse increases. |
| Session storage is local-only. | Chats do not persist across devices. | Documented non-goal; server persistence can be a future phase. |
| Redesign accidentally changes chat or retrieval behavior. | Regressions in the core product value. | Keep UI work scoped to Blade shells/components and validate with build, typecheck, and tests. |
| Stripped baseline feels unfinished before the new design is implemented. | Temporary visual quality drop. | Treat this as an intentional interim state and prioritize the next UI spec/design pass. |

## 16. Future Enhancements

- Durable server-side conversation history.
- Admin workflow for editing markdown-backed content.
- Richer project media and image assets.
- Contact CTA instrumentation.
- More detailed retrieval diagnostics in development.
- Expanded portfolio content set.
- Optional authenticated owner analytics dashboard.
- New Blade UI and layout system for homepage, static pages, and project pages.
