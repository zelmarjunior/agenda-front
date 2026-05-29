export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface LinkProductsToServiceRequest {
  products: Array<{
    productId: string;
    quantityPerSession: number;
  }>;
}
