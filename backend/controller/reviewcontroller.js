import Review from "../models/reviewmodel.js";

// Get all reviews
export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new review
export const addReview = async (req, res) => {
    const { rating, title, review, email } = req.body;
    const image = req.file ? req.file.path : "";

    try {
        const newReview = new Review({ rating, title, review, email, image });
        await newReview.save();
        res.status(201).json({ message: "Review added successfully!", data: newReview });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing review
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, title, review, email } = req.body;
    const image = req.file ? req.file.path : "";

    try {
        const updatedReview = await Review.findByIdAndUpdate(
            id,
            { rating, title, review, email, image },
            { new: true }
        );
        res.json(updatedReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    const { id } = req.params;

    try {
        await Review.findByIdAndDelete(id);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
