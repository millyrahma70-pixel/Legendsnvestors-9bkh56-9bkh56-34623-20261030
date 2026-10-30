import { useState } from 'react';
import { Search, RefreshCw, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminRegistrations } from '@/hooks/useAdminRegistrations';
import AdminJoiningRecord from '@/components/features/AdminJoiningRecord';
import { DIRECTORY_PAGE_SIZE } from '@/constants/admin';

export default function AdminUsersDirectory() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const query = useAdminRegistrations(search, page);
  const pages = Math.max(1, Math.ceil((query.data?.total || 0) / DIRECTORY_PAGE_SIZE));
  return <section className="space-y-6">
    <header className="rounded-2xl border border-primary/30 bg-card p-6">
      <div className="flex items-start justify-between gap-4"><div><p className="text-primary font-semibold">Shared across devices</p><h2 className="mt-2 text-2xl font-semibold">Joining directory</h2></div><Users size={28} className="text-primary shrink-0" /></div>
      <p className="mt-3 text-muted-foreground leading-relaxed">Reports refresh every 15 seconds. Phone numbers and device types are self-reported, not identity verification. Old accounts appear when their original browser next opens the updated site.</p>
      <p className="mt-4 text-3xl font-semibold text-primary">{query.data?.total ?? '—'} <span className="text-base font-normal text-muted-foreground">{search ? 'matching reports' : 'joining reports'}</span></p>
    </header>
    <div className="flex flex-col sm:flex-row gap-4 sm:items-end"><div className="flex-1 space-y-2"><Label htmlFor="joining-search" className="text-base">Search phone number</Label><div className="relative"><Search size={18} className="absolute left-3 top-4 text-muted-foreground" /><Input id="joining-search" type="tel" value={search} onChange={event => { setSearch(event.target.value.replace(/[^+0-9]/g, '')); setPage(0); }} placeholder="Enter phone digits" className="h-12 rounded-xl bg-card pl-10 text-base" /></div></div><Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()} className="h-12 rounded-xl gap-2"><RefreshCw size={18} />{query.isFetching ? 'Refreshing...' : 'Refresh'}</Button></div>
    <p className="text-muted-foreground" aria-live="polite">{query.dataUpdatedAt ? `Last refreshed ${new Date(query.dataUpdatedAt).toLocaleTimeString()}` : 'Connecting to the private directory...'}</p>
    {query.isPending ? <p role="status" className="rounded-2xl border border-border bg-card p-8">Loading joining records...</p> : query.isError ? <div role="alert" className="rounded-2xl border border-destructive/40 bg-card p-6 space-y-3"><AlertCircle className="text-[hsl(var(--error))]" /><p>{query.error.message}</p><Button onClick={() => void query.refetch()} disabled={query.isFetching}>Retry loading</Button></div> : query.data?.records.length ? <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{query.data.records.map(record => <AdminJoiningRecord key={record.id} record={record} />)}</div> : <div className="rounded-2xl border border-border bg-card p-8 space-y-3"><Users className="text-primary" /><h3 className="text-lg font-semibold">{search ? 'No matching reports' : 'No joining reports yet'}</h3><p className="text-muted-foreground leading-relaxed">{search ? 'Search using another part of the phone number.' : 'New registrations appear after cloud sync. Offline reports retry when the device reconnects.'}</p></div>}
    <nav aria-label="Joining directory pagination" className="flex items-center justify-between gap-3"><Button variant="outline" className="h-11" disabled={page === 0 || query.isFetching} onClick={() => setPage(value => value - 1)}>Previous</Button><span className="text-muted-foreground">Page {page + 1} of {Math.max(pages, page + 1)}</span><Button variant="outline" className="h-11" disabled={page + 1 >= pages || query.isFetching} onClick={() => setPage(value => value + 1)}>Next</Button></nav>
    <p className="rounded-xl border border-border bg-card p-4 text-muted-foreground leading-relaxed">These are unverified historical joining reports, not shared financial accounts. Manage verified users, balances and access in the Accounts section. Browser-only balances are not automatically trusted or imported.</p>
  </section>;
}
