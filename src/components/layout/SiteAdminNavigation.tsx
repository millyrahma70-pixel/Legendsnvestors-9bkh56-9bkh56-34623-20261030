import { Link, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Users, Banknote, Package, Gift, Settings, ScrollText, CircleArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
const items:{id:string;label:string;icon:LucideIcon}[]=[{id:'overview',label:'Dashboard',icon:LayoutDashboard},{id:'gifts',label:'Create Redeem Code',icon:Gift},{id:'recharges',label:'Recharges',icon:Banknote},{id:'products',label:'Packages',icon:Package},{id:'withdrawals',label:'Withdrawals',icon:CircleArrowDown},{id:'users',label:'Users',icon:Users},{id:'settings',label:'Website Settings',icon:Settings},{id:'audit',label:'Activity & Ledger',icon:ScrollText}];
export default function SiteAdminNavigation() {
  const [params]=useSearchParams();
  const requestedTab=params.get('tab')||'overview';
  const active=items.some(item=>item.id===requestedTab)?requestedTab:'overview';
  return <nav aria-label="Admin sections" className="admin-navigation">{items.map(({id,label,icon:Icon})=><Link key={id} to={`/admin?tab=${id}`} aria-current={active===id?'page':undefined} className={cn('admin-nav-link',active===id&&'admin-nav-link-active')}><Icon size={21} strokeWidth={1.8}/>{label}</Link>)}</nav>;
}
