import { Router } from 'express';
import { getMockingUsers, getMockingProducts, generateAndInsertData } from '../controllers/mock.controller.js';

const router = Router();

router.get('/mockingusers', getMockingUsers);

router.get('/mockingproducts', getMockingProducts);

router.post('/generateData', generateAndInsertData);

export default router;