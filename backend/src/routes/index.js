import express from 'express';
import userRouter from './user-router.js';
import authRouter from './auth-routes.js'
import appointmentRouter from './appointment-routes.js'
import reviewRouter from './review-routes.js'

const router = express.Router();

router.use('/users', userRouter);
router.use('/auth',authRouter)
router.use('/appointment',appointmentRouter)
router.use('/review',reviewRouter)

export default router;
