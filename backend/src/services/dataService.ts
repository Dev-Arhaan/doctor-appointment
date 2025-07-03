import fs from 'fs/promises';
import path from 'path';
import { Appointment, Prescription, DatabaseSchema, AppointmentFilters } from '../types';

class DataService {
  private dataPath: string;

  constructor() {
    this.dataPath = path.join(__dirname, '../data/appointments.json');
  }

  /**
   * Read data from JSON file
   */
  private async readData(): Promise<DatabaseSchema> {
    try {
      const data = await fs.readFile(this.dataPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading data file:', error);
      // Return empty structure if file doesn't exist
      return {
        appointments: [],
        prescriptions: [],
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Write data to JSON file
   */
  private async writeData(data: DatabaseSchema): Promise<void> {
    try {
      data.lastUpdated = new Date().toISOString();
      await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error writing data file:', error);
      throw new Error('Failed to save data');
    }
  }

  /**
   * Get all appointments with optional filters
   */
  async getAppointments(filters?: AppointmentFilters): Promise<Appointment[]> {
    const data = await this.readData();
    let appointments = data.appointments;

    if (filters) {
      if (filters.status) {
        appointments = appointments.filter(apt => apt.status === filters.status);
      }
      if (filters.doctorId) {
        appointments = appointments.filter(apt => apt.doctorId === filters.doctorId);
      }
      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        appointments = appointments.filter(apt => 
          new Date(apt.appointmentTime).toDateString() === filterDate
        );
      }
    }

    return appointments.sort((a, b) => 
      new Date(a.appointmentTime).getTime() - new Date(b.appointmentTime).getTime()
    );
  }

  /**
   * Get a single appointment by ID
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    const data = await this.readData();
    return data.appointments.find(apt => apt.id === id) || null;
  }

  /**
   * Create a new appointment
   */
  async createAppointment(appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const data = await this.readData();
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: this.generateId('apt'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    data.appointments.push(newAppointment);
    await this.writeData(data);
    
    return newAppointment;
  }

  /**
   * Update an existing appointment
   */
  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment | null> {
    const data = await this.readData();
    const appointmentIndex = data.appointments.findIndex(apt => apt.id === id);
    
    if (appointmentIndex === -1) {
      return null;
    }

    data.appointments[appointmentIndex] = {
      ...data.appointments[appointmentIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await this.writeData(data);
    return data.appointments[appointmentIndex];
  }

  /**
   * Create a prescription for an appointment
   */
  async createPrescription(prescriptionData: Omit<Prescription, 'id' | 'createdAt'>): Promise<Prescription | null> {
    const data = await this.readData();
    
    // Check if appointment exists
    const appointment = data.appointments.find(apt => apt.id === prescriptionData.appointmentId);
    if (!appointment) {
      return null;
    }

    const newPrescription: Prescription = {
      ...prescriptionData,
      id: this.generateId('pres'),
      createdAt: new Date().toISOString()
    };

    // Add prescription to prescriptions array
    data.prescriptions.push(newPrescription);
    
    // Update appointment with prescription
    const appointmentIndex = data.appointments.findIndex(apt => apt.id === prescriptionData.appointmentId);
    if (appointmentIndex !== -1) {
      data.appointments[appointmentIndex].prescription = newPrescription;
      data.appointments[appointmentIndex].status = 'completed';
      data.appointments[appointmentIndex].updatedAt = new Date().toISOString();
    }

    await this.writeData(data);
    return newPrescription;
  }

  /**
   * Get prescription by appointment ID
   */
  async getPrescriptionByAppointmentId(appointmentId: string): Promise<Prescription | null> {
    const data = await this.readData();
    return data.prescriptions.find(pres => pres.appointmentId === appointmentId) || null;
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `${prefix}_${timestamp}_${randomStr}`;
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ status: string; appointmentsCount: number; prescriptionsCount: number }> {
    try {
      const data = await this.readData();
      return {
        status: 'healthy',
        appointmentsCount: data.appointments.length,
        prescriptionsCount: data.prescriptions.length
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        appointmentsCount: 0,
        prescriptionsCount: 0
      };
    }
  }
}

export default new DataService();