import { z } from 'npm:zod@3.23.8';
const text = z.string().trim().min(1).max(160);
const phone = z.string().regex(/^\+?[0-9]{9,15}$/);
const money = z.number().int().min(0).max(1000000000);
const rate = z.number().min(0).max(100);
const url = z.string().url().max(300).refine(v => v.startsWith('https://'));
export const settingsSchema = z.object({
  siteName: text, announcement: z.string().max(1000), maintenance: z.boolean(), registrationOpen: z.boolean(), rechargeOpen: z.boolean(), withdrawalOpen: z.boolean(),
  registrationBonus: money, checkinReward: money, minDeposit: money.min(1), minWithdrawal: money.min(1), withdrawalFee: rate.max(99), referral1: rate, referral2: rate, referral3: rate,
  mtnAccount: phone, mtnName: text, mtnDial: z.string().regex(/^\*[0-9*]+#$/), airtelMerchant: z.string().regex(/^[0-9]{4,15}$/), airtelName: text, airtelDial: z.string().regex(/^\*[0-9*]+#$/), telegram: url.refine(v => new URL(v).hostname === 't.me'), supportPhone: phone,
}).strict().refine(c => c.referral1 + c.referral2 + c.referral3 <= 100, 'Referral rates cannot exceed 100% combined');
const bank = z.object({ network: z.enum(['MTN','Airtel']), holder: text, account: phone }).strict();
export const actionSchemas: Record<string, z.ZodType> = {
  snapshot: z.object({}).strict(),
  incomeRun: z.object({}).strict(),
  enroll: z.object({phone, referral: z.string().regex(/^[A-Za-z0-9]{0,16}$/).optional()}).strict(),
  bank: z.object({bank_card: bank}).strict(),
  purchase: z.object({id:z.number().int().positive()}).strict(),
  recharge: z.object({amount:money.min(1),network:z.enum(['MTN','Airtel']),sender:phone,reference:z.string().trim().min(3).max(100)}).strict(),
  withdraw: z.object({amount:money.min(1)}).strict(),
  checkin: z.object({}).strict(),
  redeem: z.object({code:z.string().trim().regex(/^[A-Za-z0-9]{4,24}$/)}).strict(),
  settings: z.object({version:z.number().int().positive(),config:settingsSchema}).strict(),
  product: z.object({id:z.number().int().positive(),version:z.number().int().positive(),name:text,price:money.min(1),daily_income:money,term:z.number().int().min(1).max(3650),enabled:z.boolean()}).strict(),
  status: z.object({user_id:z.string().uuid(),status:z.enum(['active','suspended'])}).strict(),
  adjust: z.object({user_id:z.string().uuid(),amount:z.number().int().min(-1000000000).max(1000000000).refine(v=>v!==0),note:z.string().trim().min(5).max(300)}).strict(),
  review: z.object({id:z.string().uuid(),decision:z.enum(['approved','rejected']),note:z.string().trim().min(5).max(300)}).strict(),
  giftCreate: z.object({code:z.string().regex(/^[A-Za-z0-9]{4,24}$|^$/),amount:money.min(1),note:z.string().max(300)}).strict(),
  giftRevoke: z.object({id:z.string().uuid()}).strict(),
  stop: z.object({id:z.string().uuid(),note:z.string().trim().min(5).max(300)}).strict(),
  resetOtp: z.object({user_id:z.string().uuid()}).strict(),
};
export const envelopeSchema = z.object({action:z.string().max(32),payload:z.record(z.unknown()).default({}),requestKey:z.string().uuid().optional(),filter:z.object({search:z.string().max(100).optional(),page:z.number().int().min(0).max(100000).optional(),orderPage:z.number().int().min(0).max(100000).optional(),orderStatus:z.enum(['all','pending','approved','rejected']).optional(),orderKind:z.enum(['all','recharge','withdrawal']).optional(),ledgerUser:z.string().uuid().optional()}).strict().default({})}).strict();
