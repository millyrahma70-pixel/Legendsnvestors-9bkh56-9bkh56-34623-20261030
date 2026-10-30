export interface SiteConfig {
  siteName: string; announcement: string; maintenance: boolean; registrationOpen: boolean; rechargeOpen: boolean; withdrawalOpen: boolean;
  registrationBonus: number; checkinReward: number; minDeposit: number; minWithdrawal: number; withdrawalFee: number; referral1: number; referral2: number; referral3: number;
  mtnAccount: string; mtnName: string; mtnDial: string; airtelMerchant: string; airtelName: string; airtelDial: string; telegram: string; supportPhone: string;
}
export interface SiteSettings { version: number; config: SiteConfig }
export interface SiteProduct { id:number; name:string; price:number; daily_income:number; term:number; enabled:boolean; version:number }
export interface PaymentAccount { network:'MTN'|'Airtel'; holder:string; account:string }
export interface SiteAccount { user_id:string; email:string; phone:string; balance:number; cumulative_income:number; referral_code:string; referred_by:string|null; status:'active'|'suspended'; bank_card:PaymentAccount|null; last_checkin:string|null; created_at:string }
export interface SiteOrder { id:string; user_id:string; phone:string; email:string; kind:'recharge'|'withdrawal'; amount:number; fee:number; received_amount:number; payment:Record<string,string>; status:'pending'|'approved'|'rejected'; note:string|null; created_at:string; resolved_at:string|null }
export interface SiteInvestment { id:string; user_id:string; phone:string; product_id:number; name:string; price:number; daily_income:number; started_at:string; ends_at:string; last_paid_at:string; total_earned:number; status:'active'|'expired'|'stopped' }
export interface SiteLedger { id:string; user_id:string; phone:string; kind:string; amount:number; description:string; created_at:string; investment_id?:string|null; period_no?:number|null; due_at?:string|null; referral_level?:number|null }
export interface SiteEarningsAutomation { configured:boolean; last_run_at:string|null; backlogged:boolean; endpoint?:string }
export interface SiteGift { id:string; code:string; amount:number; note:string|null; expires_at:string; used_by:string|null; used_at:string|null; redeemed_phone:string|null; revoked:boolean; created_at:string }
export interface SiteAudit { id:string; user_id:string; action:string; details:Record<string,unknown>; created_at:string }
export interface SiteStats { users:number; balance:number; pendingRecharge:number; pendingWithdrawal:number; deposits:number; activeInvestments:number; giftCreated:number; giftRedeemed:number; giftDistributed:number; withdrawals:number; pendingPayoutAmount:number; earningsDistributed:number; referralEarnings:number; dueIncomeAccounts:number }
export interface TeamMember { phone:string; referral_code:string; created_at:string; level:number }
export interface SiteSnapshot { automation?:SiteEarningsAutomation; personalStats:{deposits:number;withdrawals:number;referrals:number;activeProducts:number}; admin:boolean; credited:number; settings:SiteSettings; catalog:SiteProduct[]; account:SiteAccount|null; accounts:SiteAccount[]; accountCount:number; orders:SiteOrder[]; orderCount:number; investments:SiteInvestment[]; ledger:SiteLedger[]; gifts:SiteGift[]; audit:SiteAudit[]; stats:SiteStats; team:TeamMember[] }
export interface SiteFilter { search?:string; page?:number; orderStatus?:'all'|'pending'|'approved'|'rejected'; orderKind?:'all'|'recharge'|'withdrawal'; orderPage?:number; ledgerUser?:string }
export interface SiteCommand { action:string; payload:Record<string,unknown>; requestKey?:string }
