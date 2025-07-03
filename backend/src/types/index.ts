export interface Appointment {
  id: string;
  patientName: string;
  age: number;
  symptoms: string;
  appointmentTime: string; // ISO string format
  status: 'scheduled' | 'completed' | 'cancelled';
  doctorId: string;
  prescription?: Prescription;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  medicineName: string;
  dosage: string;
  instructions?: string;
  createdAt: string;
  doctorId: string;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  medicineName: string;
  dosage: string;
  instructions?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface AppointmentFilters {
  status?: 'scheduled' | 'completed' | 'cancelled';
  doctorId?: string;
  date?: string;
}

export interface DatabaseSchema {
  appointments: Appointment[];
  prescriptions: Prescription[];
  lastUpdated: string;
}