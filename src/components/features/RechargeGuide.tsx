import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
export default function RechargeGuide() {
  return <aside className="h-fit space-y-6 rounded-2xl border border-border bg-card p-6">
    <div><p className="mb-2 font-semibold text-primary">MTN & Airtel · powered by PesaJet</p><h2 className="text-xl font-semibold">Confirm safely on your phone</h2></div>
    <ol className="space-y-5 text-muted-foreground">
      <li className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-semibold text-primary">1</span><p>Enter your mobile-money number and recharge amount. The network is detected automatically.</p></li>
      <li className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-semibold text-primary">2</span><p>Check your phone for the payment prompt. Verify the amount and authorize payment on the provider’s prompt.</p></li>
      <li className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary font-semibold text-primary">3</span><p>Your balance is credited only after PesaJet confirms the payment. Pending is not a successful payment.</p></li>
    </ol>
    <p className="flex items-start gap-3 rounded-xl bg-secondary p-4 text-muted-foreground"><ShieldCheck size={22} className="mt-1 shrink-0 text-primary" />We never ask for, collect, or store your mobile-money PIN.</p>
    <div className="border-t border-border pt-4"><h3 className="font-semibold">Prompt or payment delayed?</h3><p className="mt-2 text-muted-foreground">Check the existing recharge status rather than paying again. Status checking resumes when you return to the website.</p><Link to="/recharge-status" className="mt-2 flex min-h-11 items-center text-primary hover:opacity-80">Track recharge status</Link><Link to="/customer-service" className="flex min-h-11 items-center text-muted-foreground hover:text-primary">Contact payment support</Link></div>
  </aside>;
}
