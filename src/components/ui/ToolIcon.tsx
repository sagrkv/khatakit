import {
  ReceiptIndianRupee,
  CalendarDays,
  Banknote,
  BriefcaseBusiness,
  LayoutGrid,
  Search,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  CircleAlert,
  LoaderCircle,
  RotateCcw,
  X,
  ChartPie,
  Info,
  Download,
  Calculator,
  Plus,
  Trash,
  Upload,
  CalendarClock,
} from 'lucide-react';

const icons = {
  receipt: ReceiptIndianRupee,
  calendar: CalendarDays,
  banknotes: Banknote,
  briefcase: BriefcaseBusiness,
  grid: LayoutGrid,
  search: Search,
  arrow: ArrowRight,
  shield: ShieldCheck,
  copy: Copy,
  check: Check,
  alert: CircleAlert,
  loader: LoaderCircle,
  reset: RotateCcw,
  close: X,
  chart: ChartPie,
  info: Info,
  download: Download,
  calculator: Calculator,
  plus: Plus,
  trash: Trash,
  upload: Upload,
  clock: CalendarClock,
};
interface Props {
  name: string;
  className?: string;
}
/** Decorative icons: the adjacent label or control supplies the accessible name. */
export default function ToolIcon({ name, className }: Props) {
  const Icon = icons[name as keyof typeof icons] || LayoutGrid;
  return <Icon className={className} aria-hidden="true" focusable="false" strokeWidth={1.7} />;
}
