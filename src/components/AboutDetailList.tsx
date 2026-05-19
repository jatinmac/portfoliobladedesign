'use client';

import { List, ListItem, ListItemText } from './blade/PortfolioPrimitives';

type AboutDetailListProps = {
  items: string[];
};

export function AboutDetailList({ items }: AboutDetailListProps) {
  return (
    <List variant="unordered" size="small">
      {items.map((item) => (
        <ListItem key={item}>
          <ListItemText>{item}</ListItemText>
        </ListItem>
      ))}
    </List>
  );
}
