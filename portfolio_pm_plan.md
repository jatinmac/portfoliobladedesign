# Product Manager Plan: Product Design Portfolio
### Version 1.0 | Living Document

---

> **PM's Core Mental Model Before Reading Anything Below**
>
> Stop thinking of this as a portfolio. Start thinking of it as a B2C conversion product.
>
> - **The Product** = Your Portfolio
> - **The User** = Hiring Manager / Design Manager / Recruiter
> - **The Conversion Event** = A scheduled call or interview
> - **The Revenue** = A job offer
> - **CAC (Cost to Acquire Customer)** = Time + effort spent distributing and applying
> - **LTV (Lifetime Value)** = Career trajectory unlocked by the right role
>
> Every decision in this plan is made through this lens. If a feature, section, or page doesn't move the user closer to booking that call — it gets cut.

---

## Table of Contents

1. Executive Summary
2. Problem Definition
3. User Research & Personas
4. Goals, KPIs & Funnel Metrics
5. Positioning & Unique Value Proposition
6. Product Architecture & Information Design
7. Content Strategy
8. Case Study Framework
9. Design Execution Standards
10. Distribution & Go-to-Market Strategy
11. Analytics, Measurement & Feedback Loops
12. Testing & Iteration Plan
13. Risk Register
14. Sprint Roadmap
15. Post-Launch & Lifecycle Plan

---

## 1. Executive Summary

### What Is This Product?
A product design portfolio is a **sales instrument** — not an art gallery, not a résumé attachment, not a vanity showcase. Its singular job is to move a hiring manager from skepticism to conviction fast enough to make them pick up the phone.

### What Problem Does It Solve?
**For the hiring manager:** Quickly evaluate whether a candidate can own complex design problems, drive measurable business outcomes, and operate independently in their team — without wasting time on a phone screen with someone who can't.

**For the candidate:** Differentiate from 200+ other applicants who all claim "problem-solving," "user empathy," and "impact-driven design" on their résumés.

### What Does Success Look Like?
A hiring manager lands on the portfolio, understands the candidate's value within 8 seconds, finds a case study relevant to their problem, reaches a "moment of conviction," and takes action (downloads resume, clicks contact, books a call).

### Current Status
🔴 **Pre-Development** — Strategy phase. No design, no build, no content finalized. This document is the source of truth before a single pixel is placed.

---

## 2. Problem Definition

### 2.1 The Market Problem
The product design job market is saturated. For every senior product design role at a growth-stage company, a hiring manager receives 150–400 applications. Of those, roughly 80% have portfolios. Of those portfolios, fewer than 10% demonstrate measurable business impact. The rest show polished UI with no context, no process, and no outcome.

**The opportunity:** Most designer portfolios compete on aesthetics. Winning means competing on evidence.

### 2.2 The User Problem (Hiring Manager's Perspective)
Use the Jobs-To-Be-Done framework:

> *"When I'm reviewing 50 portfolios in a sitting, I need to quickly identify whether this person can own a design problem end-to-end, communicate clearly with my PM and engineering team, and ship work that improves our metrics — so I can shortlist them for a screen without wasting my team's time."*

**Pain points of the hiring manager:**
- Too many portfolios, too little time — average review time is 90–120 seconds per portfolio
- Most portfolios show outputs (final screens) not thinking (decisions + trade-offs)
- Generic claims ("I improved UX") with no data leave them unable to justify the hire internally
- They can't tell from the portfolio how the designer works with cross-functional teams
- They have to forward the portfolio to their team — if it's hard to navigate or unclear, they won't bother

**Pain points of the recruiter (gatekeeper, first filter):**
- Needs to scan in under 30 seconds
- Looking for: correct job title, recognizable company names or logos, a resume download button they can find immediately
- Not evaluating design quality — evaluating fit signals

**Pain points of the design manager (deep evaluator):**
- Reviews after recruiter passes the candidate
- Wants to see the full design lifecycle: research → ideation → decision-making under constraint → execution → results
- Suspicious of linear "perfect process" narratives — they know real product work is messy
- Wants to see how the designer thinks, not just what they designed

### 2.3 The Product Problem
The current portfolio plan:
- Identifies the right audience ✅
- Defines the right outcome (get a call) ✅
- Lacks a clear positioning statement ❌
- Has no defined content hierarchy or IA ❌
- Has no distribution mechanics ❌
- Has no measurement plan ❌
- Has no testing protocol before launch ❌

**The gap in one sentence:** The plan knows *what* it wants to achieve but has no *how*.

---

## 3. User Research & Personas

Before designing anything, you must understand exactly who is sitting on the other side of the screen.

### Persona 1: "The Recruiter" — The Gatekeeper
**Name:** Priya, 28, Technical Recruiter at a Series B SaaS company
**Time spent on your portfolio:** 20–35 seconds
**Device:** Desktop, often with 15 tabs open simultaneously
**What she's looking for:**
- Is this person a Product Designer (not UI/Graphic/Brand)?
- Do they have experience relevant to our industry (SaaS/fintech/consumer)?
- Is there a resume I can download in one click?
- Does the portfolio look professional enough to forward to the design manager?

**What she is NOT doing:** Reading your case studies. She is scanning for signals.

**Design implication:** Hero section must communicate role + niche + level in under 8 seconds. Resume button must be in the top navigation, persistent, visible at all times.

**Moment of conviction:** She sees your name, your title ("Senior Product Designer — B2B SaaS"), a row of 2–3 recognizable company logos or metric callouts, and a clear "Download Resume" button. She sends it to the design manager.

---

### Persona 2: "The Design Manager" — The Deep Evaluator
**Name:** Arjun, 36, Head of Design at a growth-stage fintech
**Time spent on your portfolio:** 4–8 minutes if you pass the 8-second test
**Device:** Desktop, often reviewing after hours or between meetings
**What he's looking for:**
- Can this person operate with ambiguity? Show me a case where the brief was unclear.
- Do they understand business metrics, not just user metrics?
- How do they handle constraints — pushback from engineering, scope cuts, tight timelines?
- Is their visual execution at a level that doesn't embarrass the team?
- Would I trust this person to run a project without me holding their hand?

**What triggers his rejection:**
- "We conducted user interviews and found that users wanted X" — with no follow-up on what you did with that insight
- Perfect, linear case studies with no failure, no trade-off, no pivot
- Metrics that are vague ("improved user experience" — what does that mean?)
- Case studies that are either too long (loses thread) or too short (no process evidence)

**Moment of conviction:** He reads one full case study, sees a section where you describe a decision trade-off ("Engineering estimated 6 weeks; I renegotiated scope by removing X, shipping Y in 3 weeks, achieving 80% of the original goal"), and thinks: *"This person thinks like a product manager. I need to talk to them."*

---

### Persona 3: "The Hiring Manager" — The Business Stakeholder
**Name:** Meera, 42, VP of Product at a mid-market enterprise SaaS
**Time spent on your portfolio:** 2–3 minutes, usually after the design manager has already shortlisted you
**Device:** Mobile, reviewing the link the design manager forwarded over Slack
**What she's looking for:**
- Does this person understand business outcomes, not just user needs?
- Have they worked at a company that operates at our scale?
- Can they influence stakeholders — do they communicate clearly?
- Would this person make my team better?

**Moment of conviction:** She scrolls to the "Impact" section of a case study and sees: *"The redesigned onboarding reduced time-to-first-value from 14 minutes to 4 minutes, contributing to a 22% increase in Week-1 retention."* She forwards the portfolio to the recruiter: *"Schedule a call."*

---

### Persona Prioritization for Design Decisions
When two personas have conflicting needs (Recruiter wants short; Design Manager wants depth), resolve using this rule:

> **Design the entry point for the Recruiter. Design the case study depth for the Design Manager. Design the impact framing for the Hiring Manager.**

This is solved with progressive disclosure architecture (covered in Section 6).

---

## 4. Goals, KPIs & Funnel Metrics

### 4.1 The Conversion Funnel

```
AWARENESS
Who finds the portfolio and how?
    ↓
FIRST IMPRESSION (8-second test)
Does the hero communicate value fast enough to stop the scroll?
    ↓
ENGAGEMENT
Do they read at least one full case study?
    ↓
MOMENT OF CONVICTION
Do they believe this person is worth a conversation?
    ↓
ACTION (Conversion Event)
Do they click Resume, Contact, or Book a Call?
    ↓
INTERVIEW
Did the portfolio accurately set expectations that survive a real conversation?
    ↓
OFFER
Was the right candidate attracted to the right company?
```

### 4.2 Primary KPIs

| KPI | Definition | Target | Measurement Tool |
|---|---|---|---|
| Callback Rate | Applications sent → Calls scheduled | > 15% | Manual tracking (spreadsheet) |
| CTA Conversion Rate | Portfolio visitors → Resume or Contact clicks | > 8% | GA4 Events |
| Case Study Engagement Rate | Visitors who scroll past 75% of at least one case study | > 35% | Hotjar Scroll Maps |
| Time on Site | Average session duration per unique visitor | > 2.5 minutes | GA4 |
| Bounce Rate | Visitors who leave without any interaction | < 40% | GA4 |

### 4.3 Secondary KPIs

| KPI | Definition | Measurement Tool |
|---|---|---|
| Referral Source Mix | Where is traffic coming from? (LinkedIn / Direct / Email / Community) | GA4 Acquisition |
| Company-Level Visitor Identification | Which companies visited? | RB2B or Clearbit Reveal |
| Drop-off Point in Case Studies | Where do readers stop scrolling? | Hotjar Heatmaps |
| Resume Download Rate | % of visitors who download the resume | GA4 File Download Events |
| Return Visitor Rate | Did they come back? (signal of deep interest) | GA4 |

### 4.4 Extended Funnel Metrics (Post-Callback)
These require a manual tracking spreadsheet. Crucial for identifying whether the portfolio is attracting the *right* interest.

| Stage | Metric | Why It Matters |
|---|---|---|
| Portfolio view → Resume click | CTA CTR | Is the page compelling enough? |
| Resume click → Scheduled call | Interest-to-interview rate | Is the resume competitive? |
| First call → Second round / Design task | Advancement rate | Does the portfolio accurately represent your abilities? |
| Design task → Offer | Offer conversion rate | Skills-to-role fit |
| Offer → Accepted offer | Match quality | Did the portfolio attract the right companies? |

### 4.5 Rejection Debrief Protocol
Every rejection is product data. Build this tracker from Day 1:

**Spreadsheet Columns:**
Company | Role | Source | Stage Reached | Feedback Received | Hypothesis (Why Rejected) | Portfolio Change Made

After 10 applications, review patterns. If you're consistently passing recruiter screens but dropping at design manager reviews — your case study depth is the problem. If you're not getting recruiter callbacks — your positioning or distribution is the problem.

---

## 5. Positioning & Unique Value Proposition

### 5.1 Why Positioning Is the Most Critical Decision
Every other decision in this plan flows from positioning. Design, case study selection, distribution channels, tone of writing — all of it changes based on who you're targeting and what you're claiming.

A designer who says "I solve complex problems" is competing with every other designer. A designer who says "I specialize in designing onboarding flows for B2B SaaS products that reduce time-to-first-value" is competing with almost nobody.

**Positioning is not about limiting yourself. It is about making a hiring manager feel like you were built specifically for their problem.**

### 5.2 The Positioning Framework

Answer these four questions honestly before writing a single word on your portfolio:

**Question 1: What is the specific domain where your work has the most evidence?**
Examples: 0→1 product launches / Design system creation / Conversion optimization / Data visualization / B2B enterprise UX / Consumer mobile / Fintech / Healthtech / E-commerce

**Question 2: What type of company is the best context for your skills?**
- Early-stage startup (0→1, ambiguity, wearing multiple hats, shipping fast)
- Growth-stage scale-up (establishing process, scaling design, 1→10)
- Enterprise (stakeholder management, design systems, compliance-aware design)

**Question 3: What is your measurable superpower?** Not a trait ("I'm fast") but a demonstrated outcome ("I've shipped 3 products from 0→1 in under 6 months each, all reaching product-market fit within the first year").

**Question 4: What is the business outcome you reliably drive?**
- Reduced churn through improved onboarding
- Increased conversion through checkout optimization
- Reduced engineering back-and-forth through precise design systems
- Faster product velocity through structured design sprints

### 5.3 Positioning Statement Template

Once you have answers, fill this in:

> "I'm a [Title] with [X years] of experience helping [company type] [achieve specific outcome] by [your method/superpower]. My work has [most compelling metric]."

**Weak example:**
*"Product Designer with 5 years of experience. I create user-centered designs that solve complex problems and drive business value."*

**Strong example:**
*"Product Designer specializing in 0→1 B2B SaaS products. I've shipped 4 products from concept to launch — each reaching their first 1,000 users within 90 days of going live. I bridge the gap between ambiguous business goals and execution-ready design."*

**Where this goes:** First line of your hero section. Also: LinkedIn headline. Also: the first paragraph of every cold outreach email. It is your company tagline. It does not change per application — it is your market position.

### 5.4 What Your Positioning Is NOT
- It is not your job title (Product Designer)
- It is not a personality trait (I'm collaborative / I'm curious)
- It is not a tool claim (I'm a Figma expert)
- It is not a process description (I follow a human-centered design process)

All of these are table stakes. The hiring manager already assumes them. Positioning is the one thing that makes someone reading 50 portfolios pause and think: *"This person seems built for exactly what we need."*

---

## 6. Product Architecture & Information Design

### 6.1 Guiding Principle: Progressive Disclosure
The portfolio must simultaneously serve three personas with radically different time budgets and information needs. The solution is progressive disclosure — a layered information architecture that lets each persona go exactly as deep as they need without being overwhelmed.

**Layer 1 (8 seconds):** Hero section. Positions you, shows proof, provides one CTA.
**Layer 2 (60 seconds):** Case study cards. Shows the outcome of each project, enough to decide which to read.
**Layer 3 (4–8 minutes):** Full case study. Shows full lifecycle, thinking, decisions, trade-offs, results.
**Layer 4 (On request):** Deep artifacts — sanitized Figma files, research scripts, journey maps — available as downloads inside the case study.

### 6.2 Site Map

```
Home (/)
├── Hero Section
│   ├── Positioning Statement
│   ├── 2–3 Proof Points (logos or metrics)
│   └── CTAs: View Work | Download Resume
│
├── Case Studies (3 total)
│   ├── Case Study Card 1 — Outcome-led title
│   ├── Case Study Card 2 — Outcome-led title
│   └── Case Study Card 3 — Outcome-led title
│
├── About (/about)
│   ├── Design Philosophy
│   ├── How I Work (collaboration model)
│   ├── Culture Add (personal signals)
│   └── No-Go List (optional but powerful)
│
├── Individual Case Studies (/work/[project-name])
│   ├── TL;DR Header (sticky)
│   ├── The Hook
│   ├── Context
│   ├── Process (with progressive disclosure for deep artifacts)
│   ├── Solution
│   ├── Impact
│   ├── What Went Wrong / The Pivot
│   ├── Discussion Hooks (3 intentional open loops)
│   └── Deep Artifact Downloads
│
├── Product Thinking (/thinking) — optional but differentiating
│   └── 2–3 Teardowns / Friction Logs of live products
│
└── Contact (/contact)
    ├── Short form (name, company, message)
    ├── Direct email
    └── Calendly embed
```

### 6.3 The Hero Section — 8-Second Architecture

This is your highest-leverage real estate. Every word counts.

**Required elements in order:**
1. **Name** — Your full name, prominently. Not a logo. Not a symbol.
2. **Positioning Statement** — One line. From Section 5.3.
3. **Proof Strip** — 2–3 company logos (past employers or clients) OR 2–3 metric callouts ("4 products shipped 0→1" / "3M+ users impacted" / "22% retention lift"). Use logos if company names are recognizable. Use metrics if they are not.
4. **Primary CTA** — "View Work" — scrolls to case studies
5. **Secondary CTA** — "Download Resume" — opens PDF in new tab

**What the hero section must NOT contain:**
- A photo (optional, only if it adds warmth for a culture-heavy company type)
- A list of tools ("Figma, Sketch, InVision, Miro…")
- A generic mission statement ("I believe design can change the world")
- An animated background that distracts from the text
- More than two CTAs

### 6.4 Case Study Card Architecture
Each card on the homepage must answer: *"Why should I click into this?"*

**Required elements on each card:**
- Outcome-led title ("Reducing Onboarding Drop-off by 34%" not "Fintech App Redesign")
- One-line context (Company type + your role + timeframe)
- 1–2 visual preview images (high quality, but compressed)
- Key metric callout (the most impressive number from the project)
- Tags (type of work: 0→1 / Redesign / Design System / Growth)

### 6.5 The Sticky TL;DR Header
Every case study page must have a persistent header that follows the reader as they scroll. It contains:

| Field | Example |
|---|---|
| Role | Lead Product Designer |
| Timeline | 3 months (Q2 2023) |
| Team | 1 PM, 2 Engineers, 1 Researcher |
| Outcome | +22% Week-1 Retention |

This header answers the Recruiter's question in under 5 seconds. Even if they never read the case study, they leave with the key facts.

### 6.6 Presentation Mode Design
Your portfolio has two jobs: async review (they're reading it alone) and sync presentation (you're sharing your screen on a Zoom interview). Most portfolios fail at Job 2.

**Requirements for Presentation Mode:**
- Each case study section (Hook / Context / Process / Solution / Impact) must be accessible via anchor links or a floating side navigation
- Section transitions must be smooth and predictable — no awkward scrolling while speaking
- Key visuals must be large enough to read on a shared screen at 1080p
- "Before/After" comparisons must use interactive sliders, not static side-by-side images

---

## 7. Content Strategy

### 7.1 Writing Before Designing — The Cardinal Rule
**Write every word of every case study before a single design decision is made.** Design follows content. The hierarchy of the page, the visual weight, the whitespace — all of it is shaped by what the writing needs to communicate.

Designing the page first leads to content being forced into a layout rather than a layout serving the content. This is the most common mistake designer portfolios make.

### 7.2 Voice & Tone Guide
Inconsistent voice across case studies signals low communication skill — the exact quality every hiring manager is evaluating. Define your voice before writing anything.

**Write one paragraph describing yourself.** Not for the portfolio — just for calibration. Every case study must sound like the same person wrote it.

**Target voice attributes:**
- **Direct** — No hedging. Say what happened. Say what you decided. Say why.
- **Self-aware** — Acknowledge trade-offs, constraints, and mistakes. This builds more trust than a perfect narrative.
- **Evidence-first** — Every claim is supported by data, user feedback, or a demonstrable outcome.
- **Not humble-bragging** — State impact plainly. "This increased conversion by 18%" not "I'm proud to say that through my work, we saw meaningful improvements in conversion."

**Voice test:** Read every sentence aloud. If it sounds like a LinkedIn caption, rewrite it.

### 7.3 Case Study Selection Criteria
You will have 3 case studies. No more. Depth beats breadth.

**Scoring Rubric — Score each candidate project out of 20:**

| Criteria | Max Score | What It Means |
|---|---|---|
| Business Impact | 5 | Is there a measurable outcome tied to a business metric? |
| Process Depth | 4 | Can you show the full lifecycle including messy middle? |
| Decision Complexity | 4 | Were there real constraints, trade-offs, and pivots? |
| Visual Quality | 3 | Is the final execution at a level you're proud to show? |
| Relevance to Target Companies | 4 | Does this problem type match the companies you're applying to? |

**Minimum threshold to include a case study: 14/20.** If a project scores below that, cut it or replace it with a teardown in the "Product Thinking" section instead.

**Portfolio composition target:**
- Case Study 1: Your most business-impact-heavy work (leads with data)
- Case Study 2: Your most process-depth work (leads with the problem complexity)
- Case Study 3: Your most visually polished work OR your 0→1 case (leads with the design execution)

### 7.4 The "Proof of Collaboration" Requirement
Hiring managers constantly wonder: *"Can this person actually work with my engineers and PMs?"* Most portfolios never answer this question.

In at least one case study, you must explicitly narrate a cross-functional moment:

**Examples:**
- "Engineering estimated 8 weeks to build our original solution. Rather than accepting the scope cut from the PM, I ran a 3-hour constraint session with both engineers to identify which components could be simplified without destroying the core user value. We shipped in 5 weeks."
- "The PM and I disagreed about whether to prioritize the power user journey or the new user journey. I ran a 2-day spike using Maze to test both flows with 30 users. The data settled the debate — we prioritized new users and saw a 19% improvement in activation."

This single narrative type is more convincing than 10 polished Figma screens.

### 7.5 What Went Wrong — The Authenticity Section
At least one case study must contain a section explicitly about failure, a pivot, or a decision you would reverse. This is counterintuitive. Here is why it works:

Every design manager reading your portfolio has lived through failed sprints, bad assumptions, misread user research, and engineering pushback. A portfolio that shows a perfect linear journey signals one of two things to them: (1) you've never worked on a real product, or (2) you're not self-aware enough to recognize when you're wrong. Neither is hirable.

A portfolio that shows a moment of failure AND what you learned from it signals: maturity, self-awareness, intellectual honesty, and adaptability. These are precisely the qualities that separate a senior designer from a junior one.

**Structure for this section:**
1. What we assumed / what I initially designed
2. The moment we realized it wasn't working (usability test failure, negative metric, engineering constraint)
3. What I decided to do differently
4. What the outcome was
5. What I'd do differently if starting over today

---

## 8. Case Study Framework

### 8.1 The Full Case Study Structure

Every case study must follow this structure — in this order. No exceptions.

---

**SECTION 1: THE HOOK (Above the fold)**

This is the business problem stated as a headline. Not your project name. Not the company name (unless it's recognizable).

Format: "[Business problem / user pain] → [Outcome delivered]"

Example: "Users were abandoning the checkout flow at 68%. We redesigned the payment experience and recovered 22% of that drop-off in 6 weeks."

Why this works: The hiring manager immediately understands the business stakes and the result. They are already in the mindset of: *"How did they do that?"* — which makes them read the case study.

---

**SECTION 2: CONTEXT (60 seconds to read)**

Answer these questions in this order:
- What was the company and its product? (2 sentences)
- What was your role and scope of ownership?
- What was the team composition? (PM, engineers, researchers)
- What was the timeline and any notable constraints?
- Why did this project matter to the business right now? (the "why now" urgency)

---

**SECTION 3: THE PROBLEM (Deep statement)**

Two layers:
1. **Business problem:** What metric was broken? What revenue was at risk? What strategic goal was blocked?
2. **User problem:** What were users experiencing? Use direct user quotes if you have them. Use data from analytics or usability testing.

The business problem establishes stakes. The user problem establishes empathy. Both together establish that you operate at both levels simultaneously.

---

**SECTION 4: PROCESS — "Show the Messy Middle"**

This is the longest and most important section. It must show:

**Research:**
- What methods did you use and why? (not just "we conducted user interviews")
- What unexpected insight emerged? (if everything confirmed your hypothesis, it wasn't real research)
- What did you learn that changed your direction?

**Ideation:**
- Show 2–3 directions you explored (not just the final one)
- Explain why you discarded the directions you didn't pursue
- Show sketches, whiteboard photos, low-fidelity wireframes — the unglamorous thinking process

**Decision-Making Under Constraint:**
- Describe a specific moment where you had to make a trade-off
- Explain the competing options and the reasoning behind your choice
- If possible, show the conversation or framework that helped you decide

**Iteration:**
- Show a before and after of a specific design decision that changed through testing
- Quote the specific feedback that triggered the change
- Explain what you learned about your own assumptions

**Progressive Disclosure Note:** The full research appendix, user interview scripts, raw survey data, and full journey maps should be available as collapsible sections or downloadable artifacts within this section — NOT on the main case study page. This keeps the narrative clean for the Recruiter while giving the Design Manager access to everything they need.

---

**SECTION 5: SOLUTION**

Show the final design work. But every visual must be annotated.

**The annotation rule:** Every screen, component, or flow shown must have a caption that answers: *"What decision does this represent and why was it made?"*

Bad caption: "The new dashboard design"
Good caption: "We moved the primary action to the top-left after eye-tracking showed 73% of users' first fixation landed there. This reduced task completion time from 8 seconds to 3 seconds in usability tests."

Annotations are what separate a portfolio that shows what you built from a portfolio that shows how you think.

**Interactive elements:**
- Embed live Figma prototypes where possible
- Use before/after sliders for redesign projects
- If the product is live, embed a short screen recording or GIF of the core flow in action

---

**SECTION 6: IMPACT**

This section must contain at least one quantitative outcome and one qualitative outcome.

**Quantitative examples:**
- "Reduced time-to-first-value from 14 minutes to 4 minutes"
- "Increased Week-1 retention by 22%"
- "Reduced support ticket volume related to onboarding by 38%"
- "Increased checkout completion rate from 32% to 51%"

**If you don't have quantitative data:**
Use honest qualitative proof:
- Direct quotes from user testing ("I finally understand how to use this")
- Team velocity data ("We reduced design-to-handoff cycle time from 3 weeks to 1 week by implementing a component library")
- Comparative data ("Usability testing showed a 40% improvement in task success rate between V1 and V2")

**Never fabricate or round up aggressively.** Experienced hiring managers recognize inflated metrics. A real 8% improvement stated honestly is more credible than a suspicious 40% improvement without context.

---

**SECTION 7: WHAT WENT WRONG / THE PIVOT** *(at least one case study)*

As described in Section 7.5. This is what makes your case study human and trustworthy.

---

**SECTION 8: DISCUSSION HOOKS** *(3 per case study)*

The most underrated section in any portfolio. These are intentional open loops — design decisions or controversial choices that you deliberately leave slightly unresolved to invite interview questions.

**Why this works:** The interview is where you get hired. If your portfolio primes the interviewer with exactly the right questions, you walk in knowing what you'll be asked, having already prepared the ideal answer. You've engineered the interview before it begins.

**Structure:**
> "We debated [Option A] vs [Option B]. We chose [Option A] because [reason]. However, [limitation]. If we'd had more time/data/resources, I would have explored [Option B] more rigorously. Happy to discuss the trade-off if you're curious."

**Example:**
> "We initially designed for desktop-first because 78% of our users were on desktop. But 40% of *new* users came in through mobile. We chose to delay the mobile experience to hit our shipping deadline. In retrospect, this created a poor first impression for a growing segment. I'd approach this differently today — happy to discuss how."

This section signals: deep self-awareness, intellectual honesty, comfort with complexity, and preparedness for interview conversations.

---

## 9. Design Execution Standards

### 9.1 Design Principles for the Portfolio Itself

**Principle 1: Hierarchy over decoration**
Every visual element must serve the information hierarchy. No decorative elements that don't direct the reader's attention toward the next key point or CTA.

**Principle 2: Scannability at every level**
A reader who only reads headings and captions must still understand the full story of each case study. If the skimmed version doesn't make sense, the structure is wrong.

**Principle 3: The portfolio proves the work**
The design quality of the portfolio is evidence of your design quality as a professional. Inconsistent spacing, unclear typography hierarchy, slow load times, broken mobile layout — all of these are louder signals than anything you write in your case studies.

**Principle 4: Restraint over maximalism**
The portfolio is not the place to show off every design trend you know. Clean, precise, intentional design communicates confidence. Cluttered, animated, effect-heavy design communicates insecurity.

### 9.2 Typography Requirements

- **Heading font:** A distinctive, considered display typeface. Not Inter. Not Roboto. Not the default.
- **Body font:** A highly readable serif or sans-serif with excellent legibility at 16px and below.
- **Scale:** Establish a clear type scale (H1, H2, H3, Body, Caption, Label) and never deviate from it.
- **Line length:** Body text maximum 70 characters per line. Beyond that, reading comprehension drops.
- **Line height:** 1.5–1.7 for body text. Never less.

### 9.3 Performance Budget — Non-Negotiable

| Metric | Target | Why |
|---|---|---|
| First Contentful Paint | < 1.5 seconds | Hiring managers bounce fast on slow sites |
| Total Page Weight (Home) | < 1.5 MB | Corporate networks are often throttled |
| Total Page Weight (Case Study) | < 3 MB | Heavy case studies should lazy-load |
| Lighthouse Performance Score | > 90 | This is also a signal of your craft |
| Lighthouse Accessibility Score | > 95 | Signals inclusive design competency |
| Mobile Usability | No issues | Many hiring managers view on mobile |

**Image optimization protocol:**
- All images exported as WebP or AVIF
- Hero images: max 400KB
- Case study images: max 200KB each, lazy-loaded below the fold
- Use srcset for responsive images

### 9.4 Accessibility as a Competency Signal — WCAG 2.1 AA

For senior roles, an inaccessible portfolio is a disqualifying signal. It tells the hiring team: this designer doesn't consider the full range of users. This is not a compliance checkbox — it is a demonstration of design maturity.

**Required:**
- Color contrast ratio: minimum 4.5:1 for all body text
- All interactive elements keyboard-navigable
- All images have descriptive alt text
- Screen reader compatible structure (proper heading hierarchy, ARIA labels where needed)
- No content conveyed by color alone
- Focus states visible on all interactive elements

**The Colophon Move:** Add a small line at the bottom of your portfolio: *"Designed with WCAG 2.1 AA accessibility compliance."* This is a quiet signal to engineering leads and design managers that you understand production-ready, inclusive design. Most designers never do this.

### 9.5 Mobile-First Requirements

- All CTAs (Resume, Contact, Book a Call) must be accessible in the top navigation on mobile — no hamburger menu buried behind 2 taps
- Case study hero sections must communicate the key outcome clearly at 375px viewport width
- No hover-dependent content on mobile
- Touch targets minimum 44x44px
- Test on real device, not just browser responsive mode

---

## 10. Distribution & Go-to-Market Strategy

### 10.1 The Core GTM Principle
A great product with no marketing fails. Distribution is not Phase 4 — it is a parallel track that begins the moment you have positioning locked (Week 1 or 2), not when the portfolio is done.

### 10.2 Distribution Channels Ranked by Leverage

**Tier 1 — Highest Leverage (most direct path to target audience)**

**LinkedIn Optimization:**
- Headline must match your positioning statement exactly
- About section: 3 paragraphs — who you are, what you've shipped, what you're looking for (with a link to portfolio)
- Featured section: Pin your portfolio link as Card 1, your best case study as Card 2
- Profile photo: professional, well-lit, shows your face clearly
- Background image: a clean visual from your best case study with your positioning statement overlaid

**Direct Outreach Campaign:**
- Build a list of 50 target companies (not job listings — companies)
- For each company, identify the Design Manager or Head of Design on LinkedIn (not the recruiter)
- Outreach message formula: 
  > "[What you noticed about their product] → [Specific connection to your experience] → [Portfolio link to the most relevant case study]"
- Never send the homepage. Send the specific case study most relevant to their problem.
- Message length: Under 100 words. Hiring managers don't read walls of text.

**Tier 2 — Medium Leverage**

**LinkedIn Content Strategy:**
- Post one "case study snippet" per week: a single insight, a before/after image, or a design decision from a project with the outcome stated
- End every post with: "Full case study at [link]"
- Target format: image carousel (performs highest on LinkedIn algorithm currently)
- Do not post generic design opinions. Post specific evidence of your thinking.

**Community Seeding:**
- Identify 3–5 active communities where your target hiring managers hang out (design leadership Slack groups, specific Twitter/X communities, Product Design communities)
- Contribute value first (answer questions, share insights) for 2–3 weeks before dropping your portfolio link
- When you share your portfolio, share it with context: "Built this case study on [specific problem] — curious if this framing resonates with design managers who've faced similar challenges"

**Tier 3 — Long-Term Leverage (compound over time)**

**SEO for Passive Discovery:**
- Page titles: "[Name] — Product Designer — [Specialty] — [City]"
- Meta description: Your positioning statement
- Case study URLs: `/work/[outcome-led-slug]` not `/work/project-1`
- H1 tags: Outcome-led case study titles
- Add 2–3 short-form "Product Thinking" articles to the site. These rank for design-related keywords and establish thought leadership. Topics: a specific UX problem you solved, a framework you use for a specific design challenge, a teardown of a well-known product's UX.

### 10.3 Account-Based Marketing (ABM) — For Dream Companies
For your top 5 target companies, build a customized landing page.

**URL structure:** `yourname.com/[company-name]`

**What goes on the page:**
- A custom hero: "Hi [Company] Design Team — I'm [Name]. I noticed [specific observation about their product or design challenge]. Here's why I think my work is relevant."
- 2 case studies most relevant to that company's problem space, displayed first
- A single CTA: "Let's talk" → links to Calendly or mailto

**Why this works:** It demonstrates exactly the behavior they want in a designer — you identified a real problem in their product, you connected it to your experience, you made the information easy to consume. You didn't spray a generic portfolio at their jobs page. You did the work before the interview started.

**Conversion rate:** This approach has 3–5x higher response rates than standard applications for competitive roles. It's high-effort per company, which is exactly why almost nobody does it.

### 10.4 Post-Callback Nurture — The Leave-Behind
After a hiring manager clicks your Contact button or schedules a call, what happens next?

Most designers do nothing. The hiring manager closes the tab, gets pulled into a meeting, and forgets to share your portfolio with their team.

**Build a "Leave-Behind" packet:**
- A 5–7 slide PDF that summarizes your top 2 case studies with the business context, your process highlights, and key metrics — formatted for sharing in Slack or email
- A Calendly link embedded on the Contact page and in the thank-you email so they can book without a back-and-forth
- An optional 90-second "portfolio walkthrough" video (Loom) where you narrate your thinking on your strongest case study — this is for the hiring manager who wants to share you internally but can't re-explain your work themselves

**The thank-you page after contact form submission:**
- "Thanks — I'll reply within 24 hours. In the meantime, here's a quick summary of my most relevant work for [general context]."
- Links directly to the leave-behind PDF and the Loom video

---

## 11. Analytics, Measurement & Feedback Loops

### 11.1 Analytics Stack — Set Up Before Launch Day

| Tool | Purpose | Cost |
|---|---|---|
| Google Analytics 4 | Traffic, sessions, bounce rate, referral sources | Free |
| Hotjar | Heatmaps, scroll maps, session recordings | Free tier sufficient |
| RB2B or Clearbit Reveal | Identify which companies visited | Freemium |
| Google Search Console | SEO performance, indexed pages | Free |
| Bitly or UTM parameters | Track specific outreach campaigns | Free |

### 11.2 Event Tracking Setup (GA4)

These specific events must be tracked from Day 1:

- `resume_download` — triggered when Resume PDF is downloaded
- `contact_cta_click` — triggered when Contact button is clicked
- `case_study_75_scroll` — triggered when user scrolls 75% through a case study
- `case_study_complete` — triggered when user scrolls 100% through a case study
- `artifact_download` — triggered when a Figma file or research artifact is downloaded
- `portfolio_video_play` — triggered if Loom walkthrough is embedded and played

### 11.3 Weekly Review Protocol (30 minutes, every Monday)

1. Check GA4: Sessions, bounce rate, CTA conversion rate vs. previous week
2. Check Hotjar: Where are people dropping off on the homepage? Which case study gets most scroll depth?
3. Check RB2B: Which companies visited? Any patterns (same industry, same company size)?
4. Check outreach spreadsheet: Response rate this week vs. all-time average
5. One hypothesis: Based on the data, what is the one thing to change or test this week?
6. Make the change. Note it in the changelog.

### 11.4 A/B Testing Plan (Post-Launch, Week 8 onwards)

Run one test at a time. Each test runs for minimum 2 weeks or until you have at least 100 unique visitors exposed to each variant.

| Test | Variant A | Variant B | Success Metric |
|---|---|---|---|
| Hero headline | Positioning statement (long form) | Short punchy version | CTA click rate |
| Case study order | Impact-heavy case study first | Visual-heavy case study first | Scroll depth + case study click rate |
| CTA text | "Download Resume" | "See My Full Process" | Click rate on each |
| Hero proof | Company logos | Metric callouts | Time on page + bounce rate |

### 11.5 The Pre-Mortem — Do This Before Launch

Imagine it is 6 months from now and the portfolio has failed to generate meaningful interviews. Write down every reason why. Then solve for each one before launching.

**Most likely failure modes:**

| Failure Mode | Mitigation |
|---|---|
| "It looked polished but showed no thinking" | Every image has a decision-explaining caption |
| "I couldn't find the resume/contact button" | Sticky top nav with CTA visible at all times |
| "The case studies were too long — I lost the thread" | Enforce 3-minute read rule. Use TL;DR header. |
| "I couldn't tell what industry they specialize in" | Positioning statement in hero section must be specific |
| "The site was slow and I moved on" | Performance budget enforced. Lighthouse 90+. |
| "The case studies all felt like a sales pitch with no authenticity" | "What Went Wrong" section in at least one case study |
| "I couldn't tell how they work with teams" | Explicit cross-functional narrative in at least one case study |

---

## 12. Testing & Iteration Plan

### 12.1 Pre-Launch User Testing Protocol
**Do not launch without testing with at least 3 real humans.**

**Who to recruit (in order of priority):**
1. A design manager at a company you'd consider working at (even a second-degree connection)
2. A recruiter who hires for design roles
3. A senior designer at a target company (they know what their manager looks for)

**Session structure (20 minutes each):**
- Minutes 0–2: "I'm going to share my portfolio with you. Please narrate what you're thinking as you go through it. I'll stay quiet."
- Minutes 2–10: Watch them navigate. Don't guide them. Note where they pause, where they accelerate, where they stop.
- Minutes 10–15: Ask: "What is this person's specialty? Would you call them in for an interview? What would make you not call them?"
- Minutes 15–20: Ask: "What questions does this portfolio leave unanswered? What would you want to ask them in a screen?"

**What you're looking for:**
- Can they articulate your positioning after 8 seconds? If not, rewrite the hero.
- Do they read all 3 case studies or only the first? If only the first, the others need stronger hooks on the card.
- Do they reach the CTA naturally? If they have to hunt for the resume button, it's in the wrong place.
- What questions do they have that the portfolio doesn't answer? Add those answers.

### 12.2 The 8-Second Test
Show the homepage to a fresh pair of eyes for exactly 8 seconds. Cover it. Ask:
1. What does this person do?
2. Who do they work best with (startup/enterprise/etc.)?
3. Would you consider reaching out to them?

If they can't answer question 1 and 2 correctly, the hero section fails. Rework it before testing anything else.

### 12.3 The 3-Minute Case Study Test
Time yourself reading your case study aloud. If it takes longer than 3 minutes, cut until it does. Hiring managers will not spend more than 3–4 minutes on a single case study unless they are already extremely interested.

**What to cut:**
- Contextual background that doesn't directly impact the design decisions
- Process details that show activity but not thinking ("We ran 12 user interviews" → tell me what you learned from them, not how many you ran)
- Visual iterations that don't show a meaningful decision shift
- Metrics that don't connect to a business outcome

### 12.4 Post-Launch Iteration Cadence

| Trigger | Action |
|---|---|
| Bounce rate > 50% for 2 consecutive weeks | Rework hero section |
| Case study scroll depth < 50% | Shorten case study or strengthen section hooks |
| CTA click rate < 5% | Move CTA higher, increase visual prominence, test alternative copy |
| 0 callbacks after 20 applications | Audit positioning — wrong niche or wrong audience |
| Interview feedback: "Portfolio didn't show X" | Add X in next iteration |

---

## 13. Risk Register

### 13.1 IP & Legal Risks

**Risk: Showing work that belongs to a former employer**
- Severity: High — potential for cease and desist or reputational damage
- Probability: Medium — especially for startup work where IP agreements are common

**Mitigation protocol (complete before publishing any case study):**
1. Review your employment contract for IP assignment clauses
2. If the work is covered: anonymize company name and blur or replace sensitive UI data
3. Add a footer disclaimer: *"Case studies may anonymize client names and approximate metrics for confidentiality purposes."*
4. For highly sensitive work: use a password-protected page shared only in active interview processes
5. Never show customer data, internal financial data, or proprietary competitive information even if anonymized — if in doubt, cut it

**Risk: NDA violations in case study screenshots**
- Severity: High
- Mitigation: Replace actual product screenshots with recreated wireframes or component-level mockups that communicate the design thinking without exposing the product's IP

### 13.2 Positioning Risks

**Risk: Niche too narrow — miss relevant opportunities**
- Example: Positioning as "B2B SaaS fintech designer" and missing a great consumer mobile role
- Mitigation: Your positioning is your primary message, not a hard filter. The portfolio can contain work from adjacent domains. Positioning is what opens the door; the case studies can show range.

**Risk: Niche too broad — positioning doesn't land**
- Example: "Product Designer who builds great products" — says nothing
- Mitigation: If your positioning statement could describe any designer, it's too broad. Get specific.

### 13.3 Content Risks

**Risk: Metrics are modest and highlighting them makes you look weak**
- Mitigation: Frame trajectory and context. "We moved our onboarding completion rate from 12% to 19% — below industry benchmark but a 58% relative improvement in 6 weeks" is honest, contextualized, and shows business awareness.

**Risk: Case studies become outdated quickly**
- Mitigation: Build the portfolio on a CMS or a platform that makes content editing simple (Webflow, Framer). Set a calendar reminder for 90-day content reviews.

**Risk: Portfolio sets expectations the candidate can't defend in interview**
- Mitigation: Only claim what you can discuss in depth for 20 minutes. If a case study contains inflated or vague metrics, an experienced design manager will probe it and the interview will deteriorate.

### 13.4 Technical Risks

**Risk: Portfolio slow to load, especially on corporate networks**
- Mitigation: Performance budget (Section 9.3) enforced pre-launch. Test on a throttled connection.

**Risk: Portfolio breaks on mobile**
- Mitigation: Test on at least 3 real physical devices, not just Chrome responsive mode.

**Risk: Portfolio becomes inaccessible after job is secured (outdated "open to work" messaging)**
- Mitigation: Plan a "maintenance mode" version before launch. After securing a role, update hero to: "Currently [Role] at [Company]. Not actively seeking new roles but open to interesting conversations." Keep the case studies live — they build long-term professional presence.

---

## 14. Sprint Roadmap

### Sprint 0: Foundations (Days 1–3, before any other work)
**Non-negotiable prerequisites. Nothing else starts until these are done.**

- [ ] Complete the 4 positioning questions (Section 5.2)
- [ ] Write your positioning statement (Section 5.3)
- [ ] Complete IP & NDA checklist for every candidate case study
- [ ] Score all candidate projects using the rubric (Section 7.3) — select your final 3
- [ ] Define your target company type and make a list of 50 target companies

**Output:** Positioning statement (1 sentence) + 3 confirmed case studies + 50 target companies

---

### Sprint 1: Strategy & Content (Week 1–2)
**Goal:** Every word of the portfolio written before any design begins.

- [ ] Conduct competitive audit — review 10 portfolios of designers hired at your target companies
  - What did all of them do? (table stakes)
  - What did none of them do well? (your differentiation opportunity)
- [ ] Write the hero section copy (positioning + proof points + CTA labels)
- [ ] Write the About page using the value prop structure (Section 7.5 of About Page)
- [ ] Write the case study hooks for all 3 case studies (outcome-led titles + one-paragraph summaries)
- [ ] Write the full narrative of Case Study 1 (all 8 sections)
- [ ] Draft TL;DR header content for Case Study 1

**Output:** All copy written, reviewed, and final. Not a rough draft — final.

---

### Sprint 2: Case Studies + IA (Week 3–4)
**Goal:** All content complete. Information architecture defined.

- [ ] Write the full narrative of Case Study 2
- [ ] Write the full narrative of Case Study 3
- [ ] Write Discussion Hooks for all 3 case studies (3 per study = 9 total)
- [ ] Identify deep artifacts for each case study (Figma files, journey maps, research scripts)
- [ ] Sanitize deep artifacts for publication (remove sensitive data)
- [ ] Define Site Map and IA (Section 6.2)
- [ ] **Define MVP scope:** What ships at Week 6? (Hero + 1 complete case study + About page + Contact)
- [ ] Recruit and schedule 3 pre-launch user testing sessions (design managers or senior designers)

**Output:** All case study content complete + site map approved + MVP scope defined

---

### Sprint 3: Design (Week 5–6)
**Goal:** Portfolio designed and built. Not launched yet.

- [ ] Read competitive audit findings — translate into design differentiation decisions
- [ ] Set typography system (2 fonts, full scale)
- [ ] Set color system (maximum 3 colors + neutrals)
- [ ] Design hero section — validate against 8-second test with someone in the room
- [ ] Design case study card components
- [ ] Design case study template (all 8 sections + sticky TL;DR header)
- [ ] Build the site (Webflow / Framer recommended — fast, no code required, portfolio-optimized)
- [ ] Implement progressive disclosure for deep artifacts (accordions or download links)
- [ ] Design and build the About page
- [ ] Design and build the Contact page with Calendly embed
- [ ] Implement presentation mode (anchor links + side navigation for case studies)
- [ ] **MVP launch to 5 friendly reviewers for feedback** (not public yet)

**Output:** Fully built portfolio in staging environment

---

### Sprint 4: QA, Testing & Pre-Launch (Week 7)
**Goal:** The portfolio is bulletproof before a single hiring manager sees it.

- [ ] Conduct 3 pre-launch user testing sessions (Section 12.1 protocol)
  - Capture all feedback
  - Prioritize issues: critical (fix now) vs. minor (fix post-launch)
  - Fix all critical issues before proceeding
- [ ] Run 8-second test with 3 fresh people (Section 12.2)
- [ ] Time all 3 case studies using 3-minute rule (Section 12.3)
- [ ] Lighthouse audit — hit 90+ on Performance and 95+ on Accessibility
- [ ] Mobile test on physical devices (iOS + Android)
- [ ] Install GA4 + Hotjar + configure all event tracking (Section 11.2)
- [ ] Test all CTAs, links, and downloads
- [ ] Complete IP checklist one final time before making site public
- [ ] Set up RB2B for company-level visitor identification

**Output:** Portfolio approved for public launch. No critical issues outstanding.

---

### Sprint 5: Launch & GTM (Week 8)
**Goal:** Maximum visibility on launch day with the right audience.

- [ ] Update LinkedIn: headline, about section, featured section with portfolio link
- [ ] Post portfolio launch announcement on LinkedIn (not "check out my portfolio" — post a specific insight from your strongest case study with the portfolio link)
- [ ] Begin direct outreach campaign — first 10 companies on target list
- [ ] Share in 2–3 relevant communities with context (not just a link drop)
- [ ] Build ABM page for top 3 dream companies (Section 10.3)
- [ ] Begin rejection debrief tracker

**Output:** Portfolio live + outreach begun + analytics collecting data

---

### Sprint 6: Optimize & Iterate (Week 9–12, ongoing)
**Goal:** Use data to improve conversion rate continuously.

- [ ] Monday weekly analytics review (30 minutes — Section 11.3 protocol)
- [ ] First A/B test launched by Week 9 (hero headline variant)
- [ ] Post-call feedback collected after every interview ("Was there anything in my portfolio that confused you?")
- [ ] By Week 10: review rejection debrief tracker — any patterns emerging?
- [ ] By Week 12: full portfolio audit using 4-week data. Decide: what is the one section to improve first?

---

## 15. Post-Launch & Lifecycle Plan

### 15.1 The Portfolio Is a Living Product
A portfolio is not finished on launch day. It has a lifecycle:

**Phase 1: Active job search** (current phase)
- Weekly analytics review
- Bi-weekly content updates (sharpening case study language based on interview feedback)
- A/B testing one variable at a time
- New case study added if a project ends with exceptional results

**Phase 2: Post-offer / First 90 days in new role**
- Update hero section: "Currently [Role] at [Company]"
- Remove "open to work" language
- Keep all case studies live — they continue to build professional presence
- Add a note: "Open to mentoring and speaking on [your specialty]" — this attracts junior designers reaching out, which builds your professional network

**Phase 3: 12–18 months into the role**
- Add a new case study from your current role (if not under NDA)
- Evolve positioning based on what you're now specializing in
- The portfolio pivots from job-search tool to thought leadership platform

### 15.2 Version Control & Changelog
Maintain a private changelog:

| Date | Change Made | Why | Result |
|---|---|---|---|
| [Date] | Rewrote hero positioning | Too generic — testers couldn't articulate specialty | Bounce rate dropped X% |
| [Date] | Added "What Went Wrong" to Case Study 2 | Interview feedback: portfolio felt too polished | TBD |

This changelog is both a product discipline and a future case study in itself — demonstrating that you treat your own portfolio with the same product rigor you apply to any work.

### 15.3 The Final Standard
Before any feature, section, or page goes live, ask one question:

> **Does this move a hiring manager from skepticism to conviction faster than what it replaces?**

If yes: ship it.
If no: cut it.

That is the only product principle that matters for this portfolio.

---

---

## 16. About Page — Full Content Framework

### 16.1 Why the About Page Is a Missed Sales Opportunity

Most designer About pages read like a LinkedIn bio fed through a blender. They are a list of past companies, a mention of hobbies, and a line about "passion for great design." They communicate nothing that a hiring manager couldn't learn from the resume in less time.

The About page has one job: to make a hiring manager feel like they already know you well enough to want to have a conversation. It should answer the questions they're too professional to ask on a formal screen: How do you think? How do you handle conflict? How do you work with people who aren't designers? Are you someone I'd want in a room with my CEO?

This is not a bio. It is the second half of a sales pitch that the case studies began.

### 16.2 About Page Structure

**Section 1: The Design Philosophy Statement**

Not a generic platitude. A specific, defensible point of view on design that you've earned through experience and could argue for under pressure.

Bad: *"I believe great design is at the intersection of user needs and business goals."*
(This is what every designer says. It says nothing.)

Good: *"I've learned to distrust my first solution. The most elegant design I've ever shipped was the fourth version — built after two rounds of usability testing proved my assumptions wrong. My design philosophy is simple: be the fastest person in the room to admit you don't know something, then go find out."*

This is specific. It signals humility, process discipline, and intellectual honesty. It invites a follow-up question in an interview. That's the purpose.

**Questions to answer in your philosophy statement:**
- What have you learned about design that you didn't believe when you started?
- What do you do differently from most designers you've worked with?
- What is a design belief you hold that some people might disagree with?

---

**Section 2: How I Work — The Collaboration Model**

This is the section that addresses the silent concern every hiring manager has: *"Can this designer work with my engineers and PMs without creating friction?"*

Write this section as a description of your actual working pattern — not aspirational, not generic. Be specific about how you handle the most common friction points in cross-functional design work.

**Template structure:**

> "My typical project rhythm looks like this: I invest heavily in alignment at the start — a 2-hour problem framing session with the PM before I touch Figma usually eliminates 3 rounds of revision cycles later. Once I'm in design, I share work-in-progress in Figma with engineering early — not for sign-off, but to catch feasibility issues while the design is still fluid enough to change cheaply. I give feedback in writing and visuals, not just verbal — every design decision has a comment explaining the 'why' so the team can make good trade-off decisions when I'm not in the room."

**What this communicates:**
- You understand the economics of design (expensive changes late = avoid them)
- You're proactive about engineering relationships
- You document your decisions (reduces back-and-forth)
- You build systems, not just screens

---

**Section 3: What I'm Looking For**

Be direct about the environment where you do your best work. This is not about being selective for its own sake — it is about attracting the right companies and repelling the wrong ones before anyone wastes time.

**Template:**

> "I do my best work in environments where design has a seat at the product strategy table — where I'm brought into the 'what should we build' conversation, not just the 'make this look good' conversation. I thrive with a clear problem, access to users, and a cross-functional team that debates ideas openly. I get slower in environments where decisions are made by hierarchy rather than evidence."

**What this communicates:**
- You know your strengths and context requirements
- You are experienced enough to have preferences
- You will help the hiring manager filter for fit — which they deeply appreciate

---

**Section 4: The "No-Go" List** *(optional — high risk, high reward)*

A short, honest statement of the working conditions that bring out your worst work.

This is the most unusual thing a designer can put on a portfolio, and for precisely that reason, it is the most memorable. Senior hiring managers who have themselves been in bad fits will read this and think: *"Finally, someone who's self-aware."*

**Examples:**

> "I'm not a great fit for teams that treat user research as a checkbox before a pre-decided solution. I ask a lot of 'why are we building this' questions — if that's friction, we'll both be frustrated."

> "I don't do well in environments where feedback means 'make it more blue' rather than 'here's the user problem we're not solving.'"

**Risks to manage:** Keep this professional and about working style, never about specific past employers, people, or companies. Frame as self-knowledge, not grievance.

---

**Section 5: The Human Signal**

One short paragraph that communicates who you are outside of design. Not a laundry list of hobbies. One specific thing that tells a human story and connects back to your design thinking.

Bad: *"In my spare time I enjoy hiking, cooking, and photography."*
Good: *"I restore old motorcycles on weekends. There's something about taking something broken, understanding exactly why it's broken, and making it work better than it did originally that feels very familiar to product design work. Also, engineers respect you more when you know how torque specs work."*

The goal: make the hiring manager laugh slightly, or feel something, or remember one thing about you after closing 50 tabs.

---

## 17. The "Product Thinking" Section — Teardowns & Friction Logs

### 17.1 Why This Section Exists

Your case studies show past work. But hiring managers want to know how your brain works *today* — and most of your best past work is either under NDA or was done 2 years ago on a product that has since been redesigned.

The Product Thinking section fills this gap. It is a set of 2–3 short, highly visual analyses of real products you use — identifying UX friction, business reasoning, and what you would change. It requires no NDA approval. It can be created in a week. And it demonstrates product sense more directly than any case study can.

**What it signals to a hiring manager:**
- You think about design problems outside of work
- You understand the relationship between UX decisions and business outcomes
- You are analytical, not just aesthetic
- You have opinions — informed, reasoned ones

### 17.2 Teardown Structure

Each teardown is 3–5 minutes to read. Not a blog post. Not a thesis. A tight, visual, evidence-based critique.

**Section 1: The Observation (1 paragraph)**
Name the specific product, the specific flow, and the specific friction point you identified. Be precise. *"The onboarding flow of [App]"* is too broad. *"The moment between signup completion and first meaningful action in [App]'s dashboard"* is the right level.

**Section 2: The Business Problem (1 paragraph)**
What is the likely business impact of this friction? Connect the UX problem to a metric. *"If [App]'s onboarding drop-off follows industry benchmarks for SaaS, they're likely losing 40–60% of signups before first value. Given their stated $X ARR goal and free-to-paid conversion model, this represents..."*

This paragraph proves you think in business terms, not just user experience terms.

**Section 3: The User Problem (visual + 1 paragraph)**
Screenshot the specific friction point. Annotate it. What is the user experiencing? What are they likely thinking at this moment? What do they need that the product isn't providing?

**Section 4: The Fix (visual)**
Show what you would change. This does not need to be a full redesign. It can be a wireframe annotation, a simple sketch, or a reordering of the existing elements. The goal is to demonstrate your design reasoning, not your visual execution skill.

**Section 5: The Trade-off (1 paragraph)**
Every fix creates new problems. Name the trade-off your solution introduces and how you'd address it. This is the paragraph that separates a junior designer's teardown from a senior one's.

*"Moving the tutorial step here would increase time-to-first-action, which could hurt activation metrics for users who already understand the product category. A smarter implementation would be a conditional: show the tutorial only for users coming from organic search (likely less familiar), hide it for users coming from a paid campaign landing page (likely primed by the ad)."*

### 17.3 Which Products to Tear Down

**Choose products that:**
- Are in the same space as your target companies (if applying to fintech, tear down a fintech product)
- Are well-known enough that the hiring manager will recognize them immediately
- Have a specific, non-obvious friction point (not "the homepage is cluttered" — everyone sees that)
- You genuinely find interesting — forced analysis is obvious to read

**Avoid:**
- Tearing down a direct competitor of your target company (creates awkwardness)
- Tearing down a product that the hiring manager's company is a direct competitor to (looks like you're pitching them work you'd do for free)
- Overly critical teardowns that don't show empathy for the constraints the original team was working under

**A good teardown shows:** *"I can see the design problem, understand why the team probably made this decision anyway, and suggest a better path that accounts for their real constraints."*

---

## 18. Tools & Technology Stack

### 18.1 Platform Recommendation

**Recommended: Webflow or Framer**

Both require no code, produce fast-loading sites, support responsive design natively, and are purpose-built for portfolio-level work. Choose based on comfort:

| Platform | Best For | Trade-off |
|---|---|---|
| Webflow | More control over layout, better CMS for updating content | Steeper learning curve |
| Framer | Faster to build, excellent animation capabilities | Less flexible CMS |
| Notion + Super.so | Fastest to ship, easiest to update | Looks like a Notion site — not ideal for senior roles |
| Custom code | Maximum control, demonstrates technical ability | Significant time investment |

**Avoid:** Behance, Dribbble portfolio tools, or LinkedIn as your primary portfolio. These platforms control your design, your URL, and your data. Own your presence.

### 18.2 Full Tool Stack

| Category | Tool | Purpose | Cost |
|---|---|---|---|
| **Portfolio Builder** | Webflow / Framer | Design + build site | Free tier available |
| **Analytics** | Google Analytics 4 | Traffic and behavior | Free |
| **Heatmaps** | Hotjar | Scroll depth, click maps, session recordings | Free tier (35 sessions/day) |
| **Company ID** | RB2B | See which companies visited your site | Free tier (100 contacts/mo) |
| **SEO** | Google Search Console | Indexing and keyword performance | Free |
| **Scheduling** | Calendly | Reduce back-and-forth for booking calls | Free tier |
| **Video Walkthrough** | Loom | 90-second portfolio narration for leave-behind | Free tier |
| **Prototypes** | Figma | Embedded interactive prototypes in case studies | Free |
| **UTM Tracking** | Google Campaign URL Builder | Track which outreach campaigns drive traffic | Free |
| **CRM/Tracker** | Airtable or Notion | Application tracking + rejection debrief | Free |
| **PDF Creation** | Figma → PDF | Leave-behind case study summary packet | Free |
| **Performance Testing** | Google Lighthouse | Performance + accessibility audit | Free (built into Chrome) |
| **Image Optimization** | Squoosh | Compress images to WebP without quality loss | Free |

### 18.3 Domain & Hosting

**Domain:** Register `[yourfullname].com` — not `[yourname]design.com`, not `[yourname]portfolio.io`. Your name is the brand. Keep it simple.

If your name is common or taken:
- `[firstname][lastname].design`
- `[firstnamelastname].co`
- Avoid adding words like "design," "portfolio," "studio" — they date quickly

**Hosting:** Both Webflow and Framer include hosting. For custom-built sites, Vercel is the standard for speed and simplicity.

---

## 19. Outreach Templates & Scripts

### 19.1 The Cold Outreach Framework

Cold outreach for a portfolio has three variables:
1. **Who you're reaching** (recruiter vs. design manager — different messages)
2. **What you're linking** (homepage vs. specific case study — always link the specific case study)
3. **Why now** (what triggered your outreach — always have a specific reason)

The biggest mistake: sending the same message to 100 people. Personalization does not mean writing a novel — it means one specific observation about their company, their product, or their team that proves you did 5 minutes of research before clicking send.

**The 3-line rule:** Every outreach message must be readable and fully understandable in 3 lines on a phone screen. If it requires scrolling, it will not be read.

---

### 19.2 LinkedIn DM — Design Manager / Head of Design

**Template:**

> Hi [Name],
>
> I've been following [Company]'s design work — particularly how you handled [specific product decision or launch they made recently]. It maps closely to a problem I spent [X months] solving at [past company], where we [1-sentence outcome].
>
> I'd love to share the full story — [direct link to most relevant case study]. Worth a 20-minute conversation?

**Why this works:**
- Line 1: Specific observation (proves you researched them)
- Line 2: Direct connection to your experience with a result
- Line 3: One soft CTA with a low-friction link and a time-bounded ask

**What to customize per message:** The specific observation in Line 1. Spend 5 minutes on their LinkedIn, their company blog, or their product changelog. Find one recent, specific thing. Everything else can stay consistent.

---

### 19.3 LinkedIn DM — Recruiter

**Template:**

> Hi [Name],
>
> I'm a [title] with [X years] specializing in [your niche]. I noticed you're hiring for [role] at [company] — I think there's a strong overlap with my background in [specific area].
>
> My portfolio is at [link] and my resume is directly downloadable from the top of the page. Happy to connect if it looks like a fit.

**Why this is different from the Design Manager message:** Recruiters are evaluating fit signals fast. They don't have time for a story. Give them exactly what they need: your title, your specialty, a direct portfolio link, and an easy path to the resume. No fluff.

---

### 19.4 Cold Email — For When You Have a Direct Email Address

**Subject line options** (A/B test these):
- "Product Designer — [specific specialty] — [mutual connection or shared context]"
- "[Company name] + [Your Name] — worth a conversation?"
- "Re: [Job Title] role — quick question"

**Body:**

> Hi [Name],
>
> [One sentence specific to their company — a product decision, a recent launch, a design challenge you noticed in their product.]
>
> I'm a [title] who has spent the last [X years] focused on [specific domain]. The most relevant piece of my work is probably [outcome-led case study title] — [direct link].
>
> I'm currently exploring new roles and [Company] is at the top of my list for [one specific honest reason — their product, their team, their market position].
>
> Is there 20 minutes to connect?
>
> [Name]

**Total length:** Under 100 words. Non-negotiable. Hiring managers read email on their phones between meetings.

---

### 19.5 The ABM Landing Page Message (For Dream Companies)

This is the custom hero text at the top of your `yourname.com/[company]` page.

**Template:**

> "Hi [Company] Design Team —
>
> I'm [Name], a [positioning statement in full].
>
> I've been thinking about [specific UX challenge or product problem you've noticed in their product — 1–2 sentences]. It's a problem I've worked on directly: [link to most relevant case study].
>
> I'm not spraying applications. [Company] is one of five companies I'm actively pursuing because [specific reason — their product vision, a recent announcement, a specific design leader you respect there].
>
> Below are the two case studies most relevant to your current challenges. If any of it resonates, I'd genuinely love to talk."

**What makes this different from a cover letter:** It is on your portfolio — not buried in an applicant tracking system. It is visual, not a wall of text. It links directly to relevant work. And it is findable if they Google your name.

---

### 19.6 The Post-Interview Follow-Up

Every interview ends with an opportunity most designers miss. Send this within 2 hours of the call ending:

**Email subject:** "[Company] — [Your Name] — quick follow-up"

**Body:**

> Hi [Name],
>
> Thank you for the conversation today. Three things I wanted to follow up on:
>
> 1. You mentioned [specific challenge their team is facing] — I worked on something closely related at [past company]. Here's the case study: [direct link to specific section].
>
> 2. [If they asked a question you could have answered better] — I gave a shorter answer than I wanted to on [topic]. The fuller version: [2–3 sentences].
>
> 3. I've attached a 1-page summary of my most relevant work for easy sharing with your team.
>
> Looking forward to the next step.

**Why this is powerful:**
- It demonstrates follow-through, which is directly correlated with how they'll expect you to behave on the job
- It provides the hiring manager a sharable asset — they don't have to explain your work to their team, they just forward the email
- It addresses any gaps in your interview performance proactively

---

## 20. Interview Alignment — Portfolio as Interview Preparation

### 20.1 The Portfolio-to-Interview Bridge

Most designers treat the portfolio and the interview as separate events. This is a mistake. The portfolio should engineer the interview before it begins.

Every Discussion Hook you embed in your case studies (Section 8, Section 8 of Case Study Framework) is a question you are planting. You know it is coming. You have prepared a 3-minute answer. You walk into the interview room having already scripted 9 conversations (3 per case study × 3 case studies).

This is not manipulation. It is thorough preparation — the same preparation you would do when designing a user flow. You are mapping the journey, anticipating the decision points, and reducing friction at every step.

### 20.2 For Each Discussion Hook — Prepare a 3-Part Answer

**Structure:**

1. **The context** (30 seconds): What was the situation and the trade-off?
2. **The decision** (60 seconds): What did you choose and why — including what you considered and rejected?
3. **The retrospective** (60 seconds): What would you do differently now? What did you learn?

The retrospective is the most important part. Any designer can describe a decision they made. A senior designer can articulate what they know now that they didn't know then.

### 20.3 The Questions Your Portfolio Will Always Generate

Regardless of which case studies you include, every portfolio review meeting will eventually include some version of these questions. Prepare for all of them before your first interview:

**On process:**
- "Walk me through how you typically start a new design problem."
- "How do you handle disagreement with a PM about what to prioritize?"
- "How do you know when a design is 'good enough' to ship?"

**On business thinking:**
- "How do you measure the success of your design work?"
- "Tell me about a time your design directly impacted a business metric."
- "How do you prioritize design work when there are competing stakeholder requests?"

**On collaboration:**
- "Tell me about a difficult relationship with an engineer or PM and how you handled it."
- "How do you get design buy-in from stakeholders who aren't design-literate?"
- "How do you give and receive critical feedback on design work?"

**On self-awareness:**
- "What's a design decision you made that you'd reverse today?"
- "What's your biggest blind spot as a designer?"
- "What does your best work environment look like, and what does your worst look like?"

**Preparation instruction:** Write a 200-word answer to every question above. Not to memorize — to process. The act of writing forces clarity of thought. In the interview, your answer will be natural and specific because you've already done the thinking.

### 20.4 Portfolio Review Session — How to Present It

When you're sharing your portfolio on a Zoom screen and walking a hiring manager through it, the structure matters as much as the content.

**Framework for the walkthrough (15 minutes):**

| Time | What You Say | What You're Demonstrating |
|---|---|---|
| 0–2 min | "Let me start with context — here's what I was trying to solve and why it mattered to the business." | Business acumen |
| 2–5 min | "Here's the process — specifically the moment where our initial assumptions broke and what we did about it." | Self-awareness + process rigor |
| 5–9 min | "Here's the solution — and here's the specific decision behind each key design choice." | Design thinking |
| 9–12 min | "Here's the impact — and here's what I'd do differently." | Maturity + growth mindset |
| 12–15 min | Invite discussion: "I've intentionally left [Discussion Hook] open because I wanted to hear your perspective on how your team handles this." | Intellectual curiosity + interview control |

**The last move is the most powerful:** Inviting the hiring manager's perspective on one of your Discussion Hooks turns a one-way presentation into a collaborative conversation. The interview stops feeling like an evaluation and starts feeling like the kind of dialogue they want to have with a colleague. You've already become the person they want to hire.

---

## 21. The Positioning Worksheet — Fill This In First

Before any other work in this plan begins, complete this worksheet. Every other decision flows from the answers here.

---

**STEP 1: Evidence Inventory**

List your 5 most significant design projects. For each, answer:

| Project | Business Outcome | User Outcome | Industry | Company Stage | Your Role Scope |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

**Look for patterns:** Which industries appear most? Which type of outcome (growth / retention / activation / conversion) appears most? Which company stage (early / growth / enterprise) appears most? Where is your strongest evidence?

---

**STEP 2: The Superpower Statement**

Complete this sentence as specifically as you can:

> "I am the designer you hire when you need to [specific outcome] for a [specific company type] that is struggling with [specific problem]."

Write 3 versions. Show them to 3 people who know your work. Which one makes them say "yes, that's you"?

---

**STEP 3: The Positioning Stress Test**

Read your positioning statement aloud. Then answer:

- Could this describe any other designer you know? If yes: it's too generic.
- Could a hiring manager from your target industry read this and immediately think of a role it fits? If no: it's too vague.
- Is there anything in this statement you couldn't defend with a specific example from your work? If yes: remove it.

---

**STEP 4: The Competitor Gap**

After completing the competitive audit (Sprint 1), fill this in:

| What all 10 portfolios do | What none of them do well | My differentiation |
|---|---|---|
| | | |
| | | |
| | | |

Your differentiation column becomes the brief for your portfolio's design and content strategy.

---

## 22. The Complete Case Study Writing Template

### Instructions
Use this template to write each case study before any design work begins. Fill every field completely. Do not write "TBD" in any field — if you don't have the data, that's a signal the project may not be ready to be a case study.

---

**PROJECT METADATA (For TL;DR Header)**

- Company/Product: _______________
- Your Role: _______________
- Team Composition: _______________
- Timeline: _______________ (start date → end date)
- Primary Outcome Metric: _______________

---

**SECTION 1: THE HOOK**
*(Outcome-led title in format: "Problem → Result")*

Title: _______________
One-sentence summary for card preview: _______________

---

**SECTION 2: CONTEXT**

What was the company and its product? (2 sentences max)
_______________

Why did this problem matter to the business right now? (What was the "why now"?)
_______________

What were you specifically responsible for? What was out of scope?
_______________

---

**SECTION 3: THE PROBLEM**

Business problem (what metric was broken, what goal was blocked):
_______________

User problem (what were users experiencing — include a direct user quote if available):
_______________

How was this problem discovered? (Analytics anomaly / user complaint spike / stakeholder request):
_______________

---

**SECTION 4: THE PROCESS**

What research methods did you use and why those specifically?
_______________

What was the most unexpected insight from your research?
_______________

What assumption did the research disprove?
_______________

List 3 design directions you explored:
1. _______________
2. _______________
3. _______________

Why were directions 1 and 2 rejected in favor of direction 3?
_______________

Describe one specific design decision that changed between V1 and the final version:
V1 decision: _______________
What triggered the change: _______________
Final decision: _______________

What was the cross-functional constraint that most shaped the final design?
_______________

How did you navigate it? (Specifically — not "I collaborated with engineering"):
_______________

---

**SECTION 5: THE SOLUTION**

List the 3–5 most important screens or flows to show:
1. _______________ + caption explaining the decision it represents
2. _______________ + caption
3. _______________ + caption

Is there a live prototype or recording to embed? Yes / No / Link: _______________

---

**SECTION 6: THE IMPACT**

Quantitative outcome: _______________
Context for the metric (what was it before, what is it after, over what timeframe):
_______________

Qualitative outcome (user quote, team feedback, or observational evidence):
_______________

Business outcome (how this metric connects to a business goal):
_______________

---

**SECTION 7: WHAT WENT WRONG**
*(Required in at least one case study)*

What did you assume at the start that turned out to be wrong?
_______________

What was the specific moment you realized it wasn't working?
_______________

What did you do differently as a result?
_______________

What would you do differently if starting this project today?
_______________

---

**SECTION 8: DISCUSSION HOOKS**
*(3 per case study — intentional open loops that invite interview questions)*

Hook 1: We debated _______________ vs _______________. We chose _______________ because _______________. The limitation of this choice is _______________. I'd explore _______________ with more time.

Hook 2: _______________

Hook 3: _______________

---

**SECTION 9: DEEP ARTIFACTS**
*(Available as downloads within the case study)*

What artifacts can you share?
- [ ] Sanitized Figma file
- [ ] User interview research script
- [ ] Journey map or service blueprint
- [ ] Usability testing report
- [ ] Design system component documentation

For each artifact: has it been reviewed for NDA compliance? Y/N: _______________

---

## 23. The Rejection Debrief Tracker

### 23.1 Template Structure

Build this as a spreadsheet (Airtable or Notion). Update it within 24 hours of every rejection or ghosting.

| Field | What to Record |
|---|---|
| Company | Company name |
| Role | Job title applied for |
| Source | How you found the role (LinkedIn / Referral / Cold outreach / Inbound to portfolio) |
| Date Applied | |
| Stage Reached | Applied / Recruiter screen / Portfolio review / Design task / Final interview |
| Feedback Received | Direct quote if available |
| Hypothesis (Why Rejected) | Your honest assessment |
| Portfolio Change to Make | Specific, actionable |
| Change Made Date | When you actually made the fix |

### 23.2 Pattern Recognition — Review at 10, 20, and 50 Applications

**At 10 applications:**
Look for: Are you passing the recruiter screen? If < 30% pass rate → positioning or distribution problem. If > 50% pass rate but failing at design manager review → case study depth problem.

**At 20 applications:**
Look for: Is there an industry or company stage where your callback rate is significantly higher? If yes → narrow your targeting to that segment and customize the portfolio further for it.

**At 50 applications:**
Look for: What is the most common feedback pattern from interviews that did happen? If multiple hiring managers ask the same question that your portfolio doesn't answer — that question needs to be answered in the portfolio before the interview, not during it.

### 23.3 The Data-Driven Portfolio Iteration Rule

**Make one portfolio change at a time. Never two simultaneously.**

If you change two things at once and your callback rate improves, you don't know which change caused the improvement. You've lost the ability to learn. Treat your portfolio like a product experiment: isolate variables, measure, conclude, then iterate.

---

## 24. The Master Pre-Launch Checklist

Complete this checklist before sending the portfolio link to a single human being outside your immediate circle.

### Strategy Layer
- [ ] Positioning statement written and stress-tested with 3 people
- [ ] Target company list of 50 companies built
- [ ] IP and NDA review complete for all case study content
- [ ] Competitive audit of 10 portfolios complete

### Content Layer
- [ ] All case study copy written (not designed — written)
- [ ] All 3 case study hooks are outcome-led (not project-name-led)
- [ ] Every image has a decision-explaining caption (not a description caption)
- [ ] At least one "What Went Wrong" section present
- [ ] All 9 Discussion Hooks written (3 per case study)
- [ ] Cross-functional collaboration narrative in at least one case study
- [ ] About page uses value-prop structure (not bio structure)
- [ ] Voice and tone consistent across all written content
- [ ] All deep artifacts sanitized and NDA-cleared

### Design Layer
- [ ] Hero section communicates positioning within 8 seconds (tested with 3 people)
- [ ] Sticky TL;DR header implemented on all case study pages
- [ ] Resume download button visible in top navigation on desktop AND mobile
- [ ] Contact CTA visible without scrolling on landing page
- [ ] Progressive disclosure implemented for deep artifacts
- [ ] Presentation mode (anchor links) working in all case studies
- [ ] Before/after interactive sliders implemented for redesign case studies
- [ ] Typography scale consistent — no rogue font sizes
- [ ] Color system consistent — no off-palette elements

### Technical Layer
- [ ] Google Lighthouse Performance score > 90
- [ ] Google Lighthouse Accessibility score > 95
- [ ] All images exported as WebP and compressed
- [ ] Mobile tested on at least 2 physical devices (not just browser responsive mode)
- [ ] All CTAs, links, and downloads tested and working
- [ ] GA4 installed and recording sessions
- [ ] All CTA events tagged in GA4
- [ ] Hotjar installed and recording
- [ ] Calendly embed on Contact page tested
- [ ] Domain name is `[yourname].com` (not a platform subdomain)
- [ ] SSL certificate active (https)

### Testing Layer
- [ ] 8-second test passed with 3 fresh pairs of eyes
- [ ] 3-minute rule passed for all case studies (timed aloud)
- [ ] Pre-launch user testing sessions conducted with minimum 3 people
- [ ] All critical issues from testing sessions resolved
- [ ] Post-interview follow-up email template written and ready
- [ ] Leave-behind PDF created and tested

### Distribution Layer
- [ ] LinkedIn profile updated to match portfolio positioning
- [ ] LinkedIn Featured section updated with portfolio link
- [ ] First 10 outreach messages personalized and ready to send
- [ ] UTM parameters set up for tracking outreach campaigns

**Launch condition:** Every item in the Strategy, Content, and Testing layers must be checked. Every item in the Design and Technical layers must be checked. Distribution layer items can be in progress but must be complete within 48 hours of launch.

---

## 25. The Single-Page Execution Summary

For the days when you need to recenter and remember what this entire plan is trying to do, return to this page.

---

**The Product:** Your portfolio.

**The User:** A design manager with 4 minutes and 50 other portfolios in their queue.

**The Job To Be Done:** *"Help me quickly confirm this person can own complex design problems and ship work that moves business metrics — so I can justify spending 20 minutes on a phone screen with them."*

**The Conversion Event:** They book a call.

**The 5 Things That Drive Conversion:**

1. **Positioning** — They know what you do and who you do it for within 8 seconds of landing on the page.
2. **Evidence** — Every claim is supported by a specific metric, user quote, or demonstrable outcome.
3. **Thinking** — They can see how you make decisions under constraint, not just what the final design looks like.
4. **Trust** — You've shown a failure, a trade-off, a moment of honest self-assessment. You are not a polished robot. You are a self-aware professional.
5. **Friction removal** — Resume is one click. Contact is one click. Call booking is one click. At no point do they have to work to give you an opportunity.

**The 3 Things That Kill Conversion:**

1. **Generic positioning** — "I solve complex problems and drive business value" describes every designer who ever lived.
2. **Perfect linear narratives** — Real PMs and design managers know design is messy. A flawless case study is an unbelievable case study.
3. **Friction** — A slow load, a missing resume link, a Contact form that doesn't work, a mobile layout that breaks — any one of these ends the consideration before it begins.

**The One Question to Ask Before Every Decision:**

> *Does this move a hiring manager from skepticism to conviction faster?*

If yes: build it, keep it, ship it.
If no: cut it.

---

*Document Owner: [Your Name]*
*Last Updated: [Date]*
*Next Review: [Date + 4 weeks]*
*Version: 1.0 — Complete*

---

*This document is a living product. Every interview, every rejection, every piece of hiring manager feedback is an input. Update it. Iterate it. The discipline of treating your own career the same way you'd treat a product is itself the proof that you can do this work.*
