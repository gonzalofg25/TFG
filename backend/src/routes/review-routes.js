import express from 'express';
import { createReview, getBarberReviews, getAllReviews, getBarberAverageRating } from '../controllers/reviewController.js';
import { checkToken, checkAdmin } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.post('/creareview', checkToken, createReview);
router.get('/barber/reviews', checkToken, getBarberReviews);
router.get('/admin', checkAdmin, getAllReviews)
router.get('/media/:barberUsername',checkToken, getBarberAverageRating)

export default router;
