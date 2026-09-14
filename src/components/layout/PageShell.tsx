import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ToolIcon from '../ui/ToolIcon';
import { formatLongDate } from '../../lib/utils/date';
import { usePage } from '../../seo/usePage';
interface Props {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: string;
  children: ReactNode;
  reading?: boolean;
  period?: string;
  /** ISO date the rules on this page were last reviewed. */
  reviewed?: string;
}
export default function PageShell({
  title,
  description,
  eyebrow,
  icon = 'grid',
  children,
  reading = false,
  period,
  reviewed,
}: Props) {
  const { trail } = usePage();
  return (
    <div className={`page-shell${reading ? ' page-shell-reading' : ''}`}>
      {trail.length > 0 && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {trail.map((crumb, index) =>
            index < trail.length - 1 ? (
              <Fragment key={crumb.path}>
                <Link to={crumb.path}>{crumb.name}</Link>
                <span aria-hidden="true">/</span>
              </Fragment>
            ) : (
              <span key={crumb.path} aria-current="page">
                {crumb.name}
              </span>
            )
          )}
        </nav>
      )}
      <header className="page-masthead">
        <div className="page-masthead-icon">
          <ToolIcon name={icon} />
        </div>
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          <p className="page-description">{description}</p>
          {(period || reviewed) && (
            <div className="masthead-meta">
              {period && <span className="period-badge">{period}</span>}
              {reviewed && (
                <p className="masthead-reviewed">
                  Rules last reviewed: <time dateTime={reviewed}>{formatLongDate(reviewed)}</time>
                </p>
              )}
            </div>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}
