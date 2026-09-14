import { Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { Panel } from '../components/ui/Surface';
import ToolIcon from '../components/ui/ToolIcon';
export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      description="This address does not match a page. You can find the available calculators in the tool catalogue."
      eyebrow="Page not found"
      icon="search"
      reading
    >
      <Panel>
        <div className="error-page">
          <p className="error-code">404</p>
          <Link to="/" className="button button-primary">
            Browse all tools <ToolIcon name="arrow" />
          </Link>
        </div>
      </Panel>
    </PageShell>
  );
}
