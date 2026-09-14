import type { ReactNode } from 'react';
import ToolIcon from './ToolIcon';
export function Panel({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <section className="panel">
      {title && (
        <h2 className="panel-title">
          {icon && <ToolIcon name={icon} />} {title}
        </h2>
      )}
      {children}
    </section>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="empty-state">
      <ToolIcon name="chart" />
      <h2>Your results will appear here</h2>
      <p>{children}</p>
    </div>
  );
}
export function Notice({
  title,
  tone = 'info',
  children,
}: {
  title: string;
  tone?: 'info' | 'success' | 'warning';
  children: ReactNode;
}) {
  return (
    <div className="notice" data-tone={tone}>
      <ToolIcon name={tone === 'success' ? 'check' : 'info'} />
      <div>
        <h3>{title}</h3>
        <div>{children}</div>
      </div>
    </div>
  );
}
