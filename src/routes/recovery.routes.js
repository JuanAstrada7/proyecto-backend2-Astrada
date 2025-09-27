import express from 'express';
import { requestPasswordReset, performPasswordReset, recoveryRequest } from '../controllers/recovery.controller.js';

const router = express.Router();

router.post('/request', recoveryRequest);
router.post('/reset', performPasswordReset);

export default router;
