import { HomepageChatExperience } from '../components/HomepageChatExperience';
import { getHomeHeadline } from '../lib/content/content-loader';
import { getProjectSummaries } from '../lib/content/projects';
import { getPlaceholderSuggestions } from '../lib/content/site';

export default function HomePage() {
  return (
    <HomepageChatExperience
      placeholderSuggestions={getPlaceholderSuggestions()}
      projects={getProjectSummaries()}
      emptyStateHeading={getHomeHeadline()}
    />
  );
}
