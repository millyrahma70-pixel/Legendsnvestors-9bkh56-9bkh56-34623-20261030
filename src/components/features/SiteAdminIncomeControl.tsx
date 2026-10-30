import { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import type { SiteActionProps } from '@/types/siteActions';

interface Props extends SiteActionProps { dueAccounts: number; unavailable: boolean }
export default function SiteAdminIncomeControl({ run, busy, dueAccounts, unavailable }: Props) {
  const [open, setOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const submit = () => {
    setRunning(true);
    void run('incomeRun').then(() => setOpen(false)).catch(() => {}).finally(() => setRunning(false));
  };
  return <AlertDialog open={open} onOpenChange={value => { if (!running) setOpen(value); }}>
    <AlertDialogTrigger asChild><Button variant="outline" disabled={busy || unavailable || !dueAccounts} className="admin-income-button gap-2" title={dueAccounts ? `${dueAccounts} accounts have income due` : 'No daily income is due yet'}><Play size={17} />{running ? 'Running income…' : 'Run Income'}</Button></AlertDialogTrigger>
    <AlertDialogContent className="rounded-3xl border-primary/30 bg-card"><AlertDialogHeader><AlertDialogTitle>Settle due daily income?</AlertDialogTitle><AlertDialogDescription className="text-base leading-relaxed">{dueAccounts} active accounts have income due. This run processes up to 100 accounts, credits only completed 24-hour periods and records every payment. It does not credit early, duplicate income or pay suspended accounts.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={running}>Cancel</AlertDialogCancel><AlertDialogAction disabled={running} onClick={event => { event.preventDefault(); submit(); }}>{running ? 'Settling…' : 'Run income now'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
  </AlertDialog>;
}
