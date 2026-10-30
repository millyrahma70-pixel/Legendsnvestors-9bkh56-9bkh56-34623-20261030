export interface AdminUser {
  id: string;
  email: string;
  verified: boolean;
  passwordReady: boolean;
}

export interface AdminAuthState {
  user: AdminUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export interface JoiningRecord {
  id: string;
  local_id: string;
  phone: string;
  referral_code: string;
  referred_by_code: string | null;
  device_type: 'Mobile' | 'Tablet' | 'Desktop';
  source: 'new' | 'existing';
  reported_joined_at: string;
  received_at: string;
}

export interface JoiningReport {
  localId: string;
  phone: string;
  referralCode: string;
  referredByCode: string | null;
  deviceType: JoiningRecord['device_type'];
  joinedAt: string;
  source: JoiningRecord['source'];
}
