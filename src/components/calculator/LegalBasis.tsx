import type { LegalCitation } from '../../lib/legal/types';
import ToolIcon from '../ui/ToolIcon';
export default function LegalBasis({ citations }: { citations: LegalCitation[] }) {
  if (!citations.length) return null;
  return (
    <details className="source-panel">
      <summary>
        <ToolIcon name="info" />
        <span>Sources & calculation basis</span>
        <span className="source-count">{citations.length}</span>
      </summary>
      <div className="source-list">
        {citations.map((citation) => (
          <article key={citation.source.id}>
            <div className="source-meta">
              <span className="period-badge">{citation.source.reference}</span>
              <span>{citation.source.authority}</span>
            </div>
            <blockquote>{citation.excerpt}</blockquote>
            <p>{citation.relevance}</p>
            <a href={citation.source.url} target="_blank" rel="noopener noreferrer">
              View official source <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
    </details>
  );
}
