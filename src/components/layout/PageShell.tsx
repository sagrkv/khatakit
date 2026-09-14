import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ToolIcon from '../ui/ToolIcon';
import { usePage } from '../../seo/usePage';
interface Props {
  title: string;
  description: string;
  eyebrow?: string;
  icon?: string;
  children: ReactNode;
  reading?: boolean;
  period?: string;
}
export default function PageShell({
  title,
  description,
  eyebrow,
  icon = 'grid',
  children,
  reading = false,
  period,
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
          {period && <span className="period-badge">{period}</span>}
        </div>
      </header>
      {children}
    </div>
  );
}
