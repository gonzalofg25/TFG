import express from 'express';
import { createReview, getBarberReviews } from '../controllers/reviewController.js';
import { checkToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/creareview',checkToken,createReview);
router.get('/vereview',checkToken,getBarberReviews)


export default router;
