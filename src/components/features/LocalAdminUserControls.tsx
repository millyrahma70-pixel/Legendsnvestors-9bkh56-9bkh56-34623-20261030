import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { updateUser, formatUGX } from '@/lib/storage';
import type { User } from '@/types';

interface Props { users: User[]; onRefresh: () => void }

export default function LocalAdminUserControls({ users, onRefresh }: Props) {
  return <details className="rounded-2xl border border-border bg-card p-4">
    <summary className="min-h-11 cursor-pointer text-primary font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">Local account controls ({users.length} on this device)</summary>
    <p className="text-muted-foreground my-4 leading-relaxed">These actions affect only accounts saved in this browser, not remote joining records.</p>
    <div className="grid gap-4 lg:grid-cols-2">{users.map(user => <article key={user.id} className="rounded-xl bg-secondary p-4 space-y-3">
      <h3 className="text-lg font-semibold">{user.phone}</h3><p className="text-primary font-semibold">{formatUGX(user.balance)}</p>
      <p className="text-muted-foreground">Referral: {user.referralCode}</p>
      <div className="flex flex-wrap gap-2"><Button variant="outline" className="min-h-11" onClick={() => {
        const amount = Number(prompt('Add local balance amount (UGX):'));
        if (!Number.isFinite(amount) || amount <= 0) { toast.error('Enter a positive amount'); return; }
        updateUser(user.id, { balance: user.balance + amount }); onRefresh(); toast.success('Balance updated on this device only');
      }}>Add local balance</Button><Button variant="outline" className="min-h-11" onClick={() => {
        const password = prompt('New local password (at least 6 characters):');
        if (!password) return;
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        updateUser(user.id, { password }); onRefresh(); toast.success('Password updated on this device only');
      }}>Reset local password</Button></div>
    </article>)}</div>
  </details>;
}
