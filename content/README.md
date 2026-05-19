# Content Directory - Single Source of Truth for AI Chat

Everything in this directory is what the AI assistant knows.
To update what the AI says, edit files here.

## Projects

Add or edit files in `content/projects/`.
Required frontmatter: `title`, `slug`, `summary`, `role`, `timeline`.
Optional: `order`, `tags`, `stack`, `platform`, `outcome`, `chatContext`.
Use `order` to control display order instead of prefixing filenames with numbers.

## Profile, Experience, Contact, Resume

Edit the corresponding `.md` file in `content/`.

## Chat Config

Edit `content/chat-config.yaml` for starter prompts and follow-ups.

## After Editing

- Dev mode: changes are picked up automatically.
- Production: run `npm run rag:index` to update Supabase embeddings.
- Run `npm run validate` to check for errors.
