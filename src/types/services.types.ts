export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  costPrice: number | null;
  durationMinutes: number;
  createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  costPrice?: number;
  durationMinutes: number;
}

export interface ServiceProfessional {
  id: string;
  name: string;
  specialty: string | null;
  calendarColor: string | null;
  linked: boolean;
}

export interface LinkProductsToServiceRequest {
  products: Array<{
    productId: string;
    quantityPerSession: number;
  }>;
}
