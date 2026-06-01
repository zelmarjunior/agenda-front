export type ProductType = 'SERVICE_USE' | 'RETAIL';

export interface Product {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  type: ProductType;
  isLowStock: boolean;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  unit: string;
  minimumStock: number;
  type: ProductType;
}

export interface UpdateProductRequest {
  name?: string;
  unit?: string;
  minimumStock?: number;
  type?: ProductType;
}

export interface StockAdjustmentRequest {
  quantityChange: number;
  reason: string;
}

export interface ProductFilters {
  type?: ProductType;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface StockForecastItem {
  productId: string;
  productName: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  futureConsumption: number;
  futureAppointments: number;
  willStockout: boolean;
  deficit: number;
}
