import type { SiteSnapshot } from '@/types/site';
export type RunSiteAction = (action:string,payload?:Record<string,unknown>)=>Promise<SiteSnapshot>;
export interface SiteActionProps { run:RunSiteAction; busy:boolean }
