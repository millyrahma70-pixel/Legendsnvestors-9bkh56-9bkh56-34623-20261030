import { createContext } from 'react';
import type { AdminAuthState } from '@/types/admin';

export const AdminAuthContext = createContext<AdminAuthState | undefined>(undefined);
