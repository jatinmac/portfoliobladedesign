'use client';

import { List, ListItem, ListItemText } from '../blade/PortfolioPrimitives';

type ResumeHighlightsListProps = {
  highlights: string[];
};

export function ResumeHighlightsList({ highlights }: ResumeHighlightsListProps) {
  return (
    <List variant="unordered" size="medium">
      {highlights.map((highlight) => (
        <ListItem key={highlight}>
          <ListItemText>{highlight}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
