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

export interface Admin {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
}

export interface Get {
  id: number;
  name: string;
  admin: Admin;
  employeeCount: number;
  isActive: boolean;
  dateAdded: string;
}

export interface ContactInfo {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface OrganisationData {
  contactInfo: ContactInfo;
  id: number;
  name: string;
  admin: Admin;
  employeeCount: number;
  isActive: boolean;
  dateAdded: string;
}

export interface OrganisationResponse {
  succeeded: boolean;
  message: string;
  data: OrganisationData;
  statusCode: number;
}
