import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import SiteField from '@/components/forms/SiteField';
import { productSchema } from '@/lib/siteValidations';
import type { SiteProduct } from '@/types/site';
import type { SiteActionProps } from '@/types/siteActions';
interface Props extends SiteActionProps { product:SiteProduct }
export default function SiteProductEditor({product,run,busy}:Props) {
  const [version,setVersion]=useState(product.version);
  const {register,handleSubmit,reset,watch,formState:{errors,isDirty}}=useForm<z.infer<typeof productSchema>>({resolver:zodResolver(productSchema),defaultValues:product});
  return <form onSubmit={handleSubmit(values=>{void run('product',{id:product.id,version,...values}).then(data=>{const fresh=data.catalog.find(p=>p.id===product.id);if(fresh){setVersion(fresh.version);reset(fresh);}}).catch(()=>{});})} className="space-y-4 rounded-2xl border border-primary/30 bg-card p-6"><h2 className="text-xl font-semibold">Edit VIP {product.id}</h2><SiteField label="Product name" registration={register('name')} error={errors.name?.message}/><div className="grid gap-4 sm:grid-cols-2"><SiteField label="Price (UGX)" type="number" registration={register('price',{valueAsNumber:true})} error={errors.price?.message}/><SiteField label="Daily income (UGX)" type="number" registration={register('daily_income',{valueAsNumber:true})} error={errors.daily_income?.message}/><SiteField label="Term (days)" type="number" registration={register('term',{valueAsNumber:true})} error={errors.term?.message}/></div><label className="flex min-h-12 items-center gap-3"><input type="checkbox" {...register('enabled')} className="h-5 w-5 accent-[hsl(var(--primary))]"/>Available for new purchases</label><p className="text-muted-foreground leading-relaxed">Total scheduled income: {(Number(watch('daily_income')||0)*Number(watch('term')||0)).toLocaleString()} UGX. Existing purchases keep their original daily rate and end date.</p>{version!==product.version&&<p role="alert" className="text-[hsl(var(--error))]">Product changed in another session. Reopen the editor.</p>}<Button type="submit" disabled={busy||!isDirty||version!==product.version} className="min-h-12 rounded-xl">Save product</Button></form>;
}
