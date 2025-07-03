import express from 'express';
import { PrescriptionController } from '../controllers/prescriptionController';

const router = express.Router();
const prescriptionController = new PrescriptionController();

// POST /api/prescriptions - Create new prescription
router.post('/', prescriptionController.createPrescription.bind(prescriptionController));

// GET /api/prescriptions/appointment/:appointmentId - Get prescription by appointment ID
router.get('/appointment/:appointmentId', prescriptionController.getPrescriptionByAppointmentId.bind(prescriptionController));

export default router;