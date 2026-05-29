export interface Client {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateClientRequest {
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}
