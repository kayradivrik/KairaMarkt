import express from 'express';

const router = express.Router();
// Sepet frontend'de (localStorage + context) tutuluyor
router.get('/', (_, res) => res.json({ success: true, message: 'Cart is client-side' }));

export default router;
