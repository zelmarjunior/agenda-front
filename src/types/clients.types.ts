export interface Client {
  id: string;
  name: string;
  nickname: string | null;
  phone: string | null;
  email: string | null;
  cpf: string | null;
  birthDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateClientRequest {
  name: string;
  nickname?: string;
  phone?: string;
  email?: string;
  cpf?: string;
  birthDate?: string;
  notes?: string;
}

export interface ClientSummary {
  totalVisits: number;
  totalSpent: number;
  lastAppointmentDate: string | null;
  nextAppointmentDate: string | null;
  nextAppointmentService: string | null;
}
