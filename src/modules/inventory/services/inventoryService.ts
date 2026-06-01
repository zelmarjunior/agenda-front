import { api } from '@/services/api';
import type { SuccessResponse, PaginatedResponse } from '@/types/api.types';
import type {
  CreateProductRequest,
  UpdateProductRequest,
  Product,
  ProductFilters,
  StockAdjustmentRequest,
  StockForecastItem,
} from '@/types/inventory.types';

export const inventoryService = {
  async list(
    businessId: string,
    filters: ProductFilters = {},
  ): Promise<PaginatedResponse<Product>> {
    const qs = new URLSearchParams({
      page: String(filters.page ?? 1),
      limit: String(filters.limit ?? 20),
    });
    if (filters.type) qs.set('type', filters.type);
    if (filters.lowStock) qs.set('lowStock', 'true');
    const response = await api.get<SuccessResponse<PaginatedResponse<Product>>>(
      `/businesses/${businessId}/products?${qs}`,
    );
    return response.data.data;
  },

  async get(businessId: string, productId: string): Promise<Product> {
    const response = await api.get<SuccessResponse<Product>>(
      `/businesses/${businessId}/products/${productId}`,
    );
    return response.data.data;
  },

  async create(businessId: string, data: CreateProductRequest): Promise<Product> {
    const response = await api.post<SuccessResponse<Product>>(
      `/businesses/${businessId}/products`,
      data,
    );
    return response.data.data;
  },

  async update(businessId: string, productId: string, data: UpdateProductRequest): Promise<void> {
    await api.put(`/businesses/${businessId}/products/${productId}`, data);
  },

  async adjustStock(
    businessId: string,
    productId: string,
    data: StockAdjustmentRequest,
  ): Promise<void> {
    await api.post(`/businesses/${businessId}/products/${productId}/stock-adjustment`, data);
  },

  async getForecast(businessId: string): Promise<StockForecastItem[]> {
    const response = await api.get<StockForecastItem[]>(
      `/businesses/${businessId}/products/forecast`,
    );
    return response.data;
  },

  async getLowStock(businessId: string): Promise<Product[]> {
    const response = await api.get<SuccessResponse<PaginatedResponse<Product>>>(
      `/businesses/${businessId}/products?lowStock=true&limit=50`,
    );
    return response.data.data.data;
  },
};
