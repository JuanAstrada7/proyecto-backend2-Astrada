import { Router } from 'express';
import { messagingController } from '../controllers/messaging.controller.js';

const router = Router();

router.post('/api/messaging/sms', (req, res) => messagingController.sendSMS(req, res));
router.post('/whatsapp', (req, res) => messagingController.sendWhatsApp(req, res));

export default router;