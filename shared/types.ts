// Shared types across all services

export interface ContactInquiry {
  id?: number;
  name: string;
  email: string;
  message: string;
  privacy_accepted: boolean;
  created_at?: Date;
  status?: 'new' | 'read' | 'replied' | 'archived';
}

export interface Testimonial {
  id?: number;
  name: string;
  age?: number;
  content: string;
  image_url?: string;
  is_active: boolean;
  display_order?: number;
  created_at?: Date;
}

export interface TeamMember {
  id?: number;
  name: string;
  title: string;
  bio: string;
  image_url?: string;
  email?: string;
  languages?: string[];
  specializations?: string[];
  is_active: boolean;
  display_order?: number;
  created_at?: Date;
}

export interface Service {
  id?: number;
  title: string;
  description: string;
  category: 'therapy' | 'treatment' | 'coaching' | 'other';
  image_url?: string;
  is_active: boolean;
  display_order?: number;
  created_at?: Date;
}

export interface Appointment {
  id?: number;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  preferred_date: Date;
  preferred_time: string;
  service_type: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at?: Date;
}

export interface User {
  id?: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'staff';
  full_name: string;
  is_active: boolean;
  created_at?: Date;
  last_login?: Date;
}

export interface AuthToken {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    full_name: string;
  };
}

export interface EmailNotification {
  to: string;
  subject: string;
  html_body: string;
  from?: string;
}
