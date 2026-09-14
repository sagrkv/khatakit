import { Notice } from './Surface';
export default function Disclaimer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Notice title={title} tone="warning">
      {children}
    </Notice>
  );
}
