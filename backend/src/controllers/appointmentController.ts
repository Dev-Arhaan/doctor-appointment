import { Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Appointment, AppointmentFilters } from '../types';

export class AppointmentController {
  /**
   * Get all appointments with optional filters
   * GET /api/appointments?status=scheduled&doctorId=doc_001&date=2024-12-15
   */
  async getAppointments(req: Request, res: Response): Promise<void> {
    try {
      const filters: AppointmentFilters = {
        status: req.query.status as any,
        doctorId: req.query.doctorId as string,
        date: req.query.date as string
      };

      Object.keys(filters).forEach(key => {
        if (filters[key as keyof AppointmentFilters] === undefined) {
          delete filters[key as keyof AppointmentFilters];
        }
      });

      const appointments = await dataService.getAppointments(
        Object.keys(filters).length > 0 ? filters : undefined
      );

      const response: ApiResponse<Appointment[]> = {
        success: true,
        data: appointments,
        message: `Retrieved ${appointments.length} appointments`
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to fetch appointments'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get a single appointment by ID
   * GET /api/appointments/:id
   */
  async getAppointmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const appointment = await dataService.getAppointmentById(id);
      
      if (!appointment) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Appointment> = {
        success: true,
        data: appointment,
        message: 'Appointment retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching appointment:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to fetch appointment'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Create a new appointment
   * POST /api/appointments
   */
  async createAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { patientName, age, symptoms, appointmentTime, doctorId } = req.body;

      // Validation
      if (!patientName || !age || !symptoms || !appointmentTime || !doctorId) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'All fields are required: patientName, age, symptoms, appointmentTime, doctorId'
        };
        res.status(400).json(response);
        return;
      }

      if (age < 0 || age > 150) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Age must be between 0 and 150'
        };
        res.status(400).json(response);
        return;
      }

      // Check if appointment time is in the future
      const appointmentDate = new Date(appointmentTime);
      if (appointmentDate <= new Date()) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment time must be in the future'
        };
        res.status(400).json(response);
        return;
      }

      const appointmentData = {
        patientName,
        age: parseInt(age),
        symptoms,
        appointmentTime,
        doctorId,
        status: 'scheduled' as const
      };

      const newAppointment = await dataService.createAppointment(appointmentData);

      const response: ApiResponse<Appointment> = {
        success: true,
        data: newAppointment,
        message: 'Appointment created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating appointment:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to create appointment'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Update appointment status
   * PATCH /api/appointments/:id/status
   */
  async updateAppointmentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!id || !status) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment ID and status are required'
        };
        res.status(400).json(response);
        return;
      }

      if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Status must be one of: scheduled, completed, cancelled'
        };
        res.status(400).json(response);
        return;
      }

      const updatedAppointment = await dataService.updateAppointment(id, { status });
      
      if (!updatedAppointment) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment not found'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Appointment> = {
        success: true,
        data: updatedAppointment,
        message: 'Appointment status updated successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to update appointment status'
      };
      res.status(500).json(response);
    }
  }
}