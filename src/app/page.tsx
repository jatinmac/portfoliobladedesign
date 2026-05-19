import { HomepageChatExperience } from '../components/HomepageChatExperience';
import { getHomeHeadline } from '../lib/content/content-loader';
import { getProjectSummaries } from '../lib/content/projects';
import { getStarterPrompts } from '../lib/content/site';

export default function HomePage() {
  return (
    <HomepageChatExperience
      starterPrompts={getStarterPrompts()}
      projects={getProjectSummaries()}
      emptyStateHeading={getHomeHeadline()}
    />
  );
}
