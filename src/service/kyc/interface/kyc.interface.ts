export interface KycInformation {
  organisationId: number;
  firstname: string;
  middlename: string;
  lastname: string;
  phone: string;
  email: string;
  gender: string;
  country: string;
  address: string;
  bvn: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

export interface KycDocument {
  documentType: string;
  documentUrl: string;
  status: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

export interface KycData {
  organisationId: number;
  information: KycInformation;
  documents: KycDocument[];
  status: string;
  id: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  modifiedAt: string | null;
}

export interface Get {
  succeeded: boolean;
  message: string;
  data: KycData;
  statusCode: number;
}
