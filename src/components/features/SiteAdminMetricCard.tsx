import { ArrowUpRight, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props { label: string; value: string; detail: string; icon: LucideIcon; to: string; featured?: boolean }

export default function SiteAdminMetricCard({ label, value, detail, icon: Icon, to, featured }: Props) {
  return <Link to={to} className={`admin-metric group ${featured ? 'admin-metric-featured' : ''}`}>
    <div className="flex items-start justify-between gap-2">
      <span className="admin-icon-tile"><Icon size={23} strokeWidth={1.8} /></span>
      <ArrowUpRight size={17} className="text-muted-foreground opacity-50 transition-opacity group-hover:opacity-100" />
    </div>
    <h3 className="mt-5 text-base font-medium text-muted-foreground">{label}</h3>
    <p className="mt-1 break-words text-xl font-bold tracking-tight text-primary sm:text-2xl">{value}</p>
    <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
  </Link>;
}
