import express from 'express';
import { requestPasswordReset, performPasswordReset } from '../controllers/recovery.controller.js';

const router = express.Router();

router.post('/request', requestPasswordReset);

router.post('/reset', performPasswordReset);

export default router;
