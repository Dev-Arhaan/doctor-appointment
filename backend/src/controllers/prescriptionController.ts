import { Request, Response } from 'express';
import dataService from '../services/dataService';
import { ApiResponse, Prescription, CreatePrescriptionRequest } from '../types';

export class PrescriptionController {
  /**
   * Create a prescription for an appointment
   * POST /api/prescriptions
   */
  async createPrescription(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId, medicineName, dosage, instructions }: CreatePrescriptionRequest = req.body;

      // Validation
      if (!appointmentId || !medicineName || !dosage) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'appointmentId, medicineName, and dosage are required'
        };
        res.status(400).json(response);
        return;
      }

      // Check if appointment exists
      const appointment = await dataService.getAppointmentById(appointmentId);
      if (!appointment) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment not found'
        };
        res.status(404).json(response);
        return;
      }

      // Check if prescription already exists for this appointment
      if (appointment.prescription) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Prescription already exists for this appointment'
        };
        res.status(409).json(response);
        return;
      }

      const prescriptionData = {
        appointmentId,
        medicineName,
        dosage,
        instructions: instructions || '',
        doctorId: appointment.doctorId
      };

      const newPrescription = await dataService.createPrescription(prescriptionData);
      
      if (!newPrescription) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Failed to create prescription'
        };
        res.status(500).json(response);
        return;
      }

      const response: ApiResponse<Prescription> = {
        success: true,
        data: newPrescription,
        message: 'Prescription created successfully'
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating prescription:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to create prescription'
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get prescription by appointment ID
   * GET /api/prescriptions/appointment/:appointmentId
   */
  async getPrescriptionByAppointmentId(req: Request, res: Response): Promise<void> {
    try {
      const { appointmentId } = req.params;

      if (!appointmentId) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Appointment ID is required'
        };
        res.status(400).json(response);
        return;
      }

      const prescription = await dataService.getPrescriptionByAppointmentId(appointmentId);
      
      if (!prescription) {
        const response: ApiResponse<never> = {
          success: false,
          error: 'Prescription not found for this appointment'
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<Prescription> = {
        success: true,
        data: prescription,
        message: 'Prescription retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      const response: ApiResponse<never> = {
        success: false,
        error: 'Failed to fetch prescription'
      };
      res.status(500).json(response);
    }
  }
}