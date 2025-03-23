import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true },
    title: { type: String, required: true },
    review: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
});

export default mongoose.model('Review', reviewSchema);