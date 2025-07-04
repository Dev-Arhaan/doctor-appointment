import express from 'express';
import { AppointmentController } from '../controllers/appointmentController';

const router = express.Router();
const appointmentController = new AppointmentController();

// GET /api/appointments - Get all appointments with optional filters
router.get('/', appointmentController.getAppointments.bind(appointmentController));

// GET /api/appointments/:id - Get single appointment by ID
router.get('/:id', appointmentController.getAppointmentById.bind(appointmentController));

// POST /api/appointments - Create new appointment
router.post('/', appointmentController.createAppointment.bind(appointmentController));

// PATCH /api/appointments/:id/status - Update appointment status
router.patch('/:id/status', appointmentController.updateAppointmentStatus.bind(appointmentController));

export default router;