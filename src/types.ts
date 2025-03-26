export interface User {
  id: string;
  email: string;
  avatar_url?: string;
  full_name?: string;
  newsletter_subscribed?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}