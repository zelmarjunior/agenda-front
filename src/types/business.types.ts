export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  allowSelfScheduling: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBusinessRequest {
  name?: string;
  address?: string;
  phone?: string;
  allowSelfScheduling?: boolean;
}
