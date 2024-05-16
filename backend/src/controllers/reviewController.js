import Review from '../models/Review.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const createReview = async (req, res) => {
  try {
    const { barberUsername, rating, comment } = req.body;

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ username: decoded.username });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const review = new Review({
      user: user.username,
      barberUsername,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({ message: 'Revisión creada exitosamente.' });
  } catch (error) {
    console.error('Error al crear la revisión:', error);
    res.status(500).json({ message: 'Error al crear la revisión.' });
  }
};

const getBarberReviews = async (req, res) => {
  try {
    const barberUsername = req.params.barberUsername;

    const reviews = await Review.find({ barberUsername: barberUsername });

    res.status(200).json({ success: true, reviews: reviews });
  } catch (error) {
    console.error('Error al obtener las revisiones del barbero:', error);
    res.status(500).json({ success: false, error: 'Error al obtener las revisiones del barbero' });
  }
};

export { createReview, getBarberReviews };
