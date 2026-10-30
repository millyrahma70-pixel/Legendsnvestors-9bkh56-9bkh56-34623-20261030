import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { withdrawalSchema } from '@/lib/siteValidations';
import { money } from '@/lib/siteApi';
import type { SiteSnapshot } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { data:SiteSnapshot }
export default function SiteWithdrawalForm({data,run,busy}:Props) {
  const cfg=data.settings.config;
  const account=data.account!;
  const {register,handleSubmit,watch,formState:{errors}}=useForm<z.infer<typeof withdrawalSchema>>({resolver:zodResolver(withdrawalSchema.refine(v=>v.amount>=cfg.minWithdrawal&&v.amount<=account.balance,{message:`Enter ${money(cfg.minWithdrawal)} or more without exceeding your balance`,path:['amount']})),defaultValues:{amount:cfg.minWithdrawal}});
  const amount=Number(watch('amount'))||0;
  const fee=Math.floor(amount*cfg.withdrawalFee/100);
  const active=data.investments.some(i=>i.status==='active'&&new Date(i.ends_at)>new Date());
  return <form onSubmit={handleSubmit(v=>{void run('withdraw',v).catch(()=>{});})} className="rounded-2xl border border-primary/30 bg-card p-6 space-y-4"><h1 className="text-2xl font-semibold">Request a withdrawal</h1><p className="text-primary text-xl font-semibold">Available {money(account.balance)}</p><p className="text-muted-foreground leading-relaxed">Minimum {money(cfg.minWithdrawal)} · {cfg.withdrawalFee}% fee. An active product and bound payment account are required. The requested amount is reserved until admin review; rejected requests are refunded.</p>{account.bank_card?<section className="rounded-xl bg-secondary p-4"><h2 className="font-semibold">Payout destination</h2><p className="mt-2">{account.bank_card.network} · {account.bank_card.account}</p><p className="mt-2 text-muted-foreground">{account.bank_card.holder}</p></section>:<Link to="/bind-card" className="inline-flex min-h-12 items-center text-primary">Bind your payment account first</Link>}<SiteField label="Withdrawal amount (UGX)" type="number" registration={register('amount',{valueAsNumber:true})} error={errors.amount?.message}/><div className="rounded-xl bg-secondary p-4 space-y-2"><p>Fee: {money(fee)}</p><p className="font-semibold text-primary">Expected payout: {money(Math.max(0,amount-fee))}</p></div>{!active&&<p className="text-muted-foreground">Purchase an active product before requesting a withdrawal.</p>}<Button type="submit" disabled={busy||!cfg.withdrawalOpen||!account.bank_card||!active} className="min-h-12 w-full rounded-xl">{busy?'Submitting...':'Submit withdrawal request'}</Button>{!cfg.withdrawalOpen&&<p className="text-muted-foreground">Withdrawals are temporarily paused.</p>}</form>;
}
