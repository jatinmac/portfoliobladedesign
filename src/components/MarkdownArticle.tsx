import { MarkdownRenderer } from './MarkdownRenderer';

type MarkdownArticleProps = {
  markdown: string;
};

export function MarkdownArticle({ markdown }: MarkdownArticleProps) {
  return <MarkdownRenderer content={markdown} variant="article" />;
}
