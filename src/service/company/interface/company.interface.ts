export interface Create {
  name: string;
  email: string;
  telephone: number;
  city: string;
  country: string;
  state: string;
  address: string;
  currency: number;
}
export interface Update {
name?: string;
  email?: string;
  telephone?: number;
  city?: string;
  country?: string;
  state?: string;
  address?: string;
  currency?: number;
}
