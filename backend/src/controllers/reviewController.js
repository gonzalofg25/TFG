import Review from '../models/Review.js';
import User from '../models/User.js';

export async function createReview(req, res){
  try {
    const { barberUsername, rating, comment } = req.body;

    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const barberUser = await User.findOne({ username: barberUsername });
    if (!barberUser) {
      return res.status(404).json({ message: 'El barbero no fue encontrado.' });
    }

    const review = new Review({
      user: user.id,
      barber: barberUser._id,
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

export async function getBarberReviews(req, res){
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const reviews = await Review.find({ barber: user._id }).populate('user', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener las revisiones:', error);
    res.status(500).json({ message: 'Error al obtener las revisiones.' });
  }
};

export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().populate('user', 'username').populate('barber', 'username');

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener todas las revisiones:', error);
    res.status(500).json({ message: 'Error al obtener todas las revisiones.' });
  }
};

export async function getBarberAverageRating(req, res){
  try {
    const barberUsername = req.params.barberUsername;

    const barberUser = await User.findOne({ username: barberUsername });
    if (!barberUser) {
      return res.status(404).json({ message: 'El barbero no fue encontrado.' });
    }

    const reviews = await Review.find({ barber: barberUser._id });

    if (reviews.length === 0) {
      return res.status(200).json({ averageRating: 0, totalVotes: 0 });
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    res.status(200).json({ averageRating, totalVotes: reviews.length });
  } catch (error) {
    console.error('Error al obtener la valoración media del barbero:', error);
    res.status(500).json({ message: 'Error al obtener la valoración media del barbero.' });
  }
};
