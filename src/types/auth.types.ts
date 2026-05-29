export interface RegisterBusinessRequest {
  businessName: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  soloMode?: boolean;
  ownerIsAlsoProfessional?: boolean;
  ownerSpecialty?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  businessId: string;
}

export interface AuthToken {
  token: string;
}

export interface JwtPayload {
  sub: string;
  businessId: string;
  roles: string[];
  exp: number;
  iat: number;
}

export interface StoredBusiness {
  businessId: string;
  businessName: string;
}

export interface AuthState {
  token: string | null;
  businessId: string | null;
  role: 'OWNER' | 'PROFESSIONAL' | 'CLIENT' | null;
  isAuthenticated: boolean;
}
