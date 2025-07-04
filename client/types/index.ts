export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientName: string;
  age: number;
  symptoms: string;
  appointmentTime: string; 
  status: AppointmentStatus;
  doctorId: string;
  createdAt: string; 
  updatedAt: string; 
}
export interface Prescription {
  id: string;
  appointmentId: string;
  medicineName: string;
  dosage: string;
  instructions: string;
  createdAt: string; 
  doctorId: string;
}

export type NewPrescription = Omit<Prescription, 'id' | 'createdAt' | 'doctorId'>;