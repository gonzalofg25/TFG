import Review from '../models/Review.js';
import User from '../models/User.js';

const createReview = async (req, res) => {
  try {
    const { barberUsername, rating, comment } = req.body;

    // Obtenemos el usuario del token verificado a través del middleware
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Buscamos al barbero por su nombre de usuario
    const barberUser = await User.findOne({ username: barberUsername });
    if (!barberUser) {
      return res.status(404).json({ message: 'El barbero no fue encontrado.' });
    }

    const review = new Review({
      user: user.id,
      barber: barberUser._id, // Utilizamos el ObjectId del barbero
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
