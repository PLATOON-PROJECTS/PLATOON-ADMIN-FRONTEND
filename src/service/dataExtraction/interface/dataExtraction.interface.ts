export interface DataExtractionFilters {
  StartDate: string;
  EndDate: string;
}

export interface DataExtractionResponse {
  data: any[];
  success: boolean;
  message?: string;
}

export interface ExtractionType {
  id: number;
  name: string;
  type: string;
}

export interface DataExtractionResult {
  type: string;
  data: any[] | null;
  success: boolean;
  error?: any;
}

