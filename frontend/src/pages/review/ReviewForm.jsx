import React, { useState } from "react";
import { Star } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReviewForm = () => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState(null);
    const [emailError, setEmailError] = useState("");

    const navigate = useNavigate();

    // Email validation pattern
    const emailPattern = /^[a-z]+[a-z0-9]*@gmail\.com$/;

    // Handle email input change with validation
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        
        if (!emailPattern.test(newEmail)) {
            setEmailError("Must be a valid Gmail address (e.g., user@gmail.com).");
        } else {
            setEmailError("");
        }
    };

    // Handle star rating selection
    const handleRatingClick = (value) => {
        setRating(value);
    };

    // Handle file input
    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        if (emailError) {
            alert("Please fix email validation errors before submitting.");
            return;
        }

        const formData = new FormData();
        formData.append("rating", rating);
        formData.append("title", title);
        formData.append("review", review);
        formData.append("email", email);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/reviews", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert(response.data.message);
            navigate("/reviewspage", { replace: true });

            // Reset form fields after submission
            setRating(0);
            setTitle("");
            setReview("");
            setEmail("");
            setImage(null);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review");
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-gray-100"
            style={{
                backgroundImage: "url('/ReviewFormBackground.jpg')", // Background Image Path
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: "100vh",
            }}
        >
            <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg bg-opacity-90">
                <h2 className="text-xl font-semibold text-center mb-4">Add Review and Ratings</h2>

                {/* Star Rating Section */}
                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={30}
                            className={`cursor-pointer mx-1 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                            onClick={() => handleRatingClick(star)}
                        />
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Review Title Input */}
                    <input
                        type="text"
                        placeholder="Review Title"
                        className="w-full p-2 border rounded-lg"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    {/* Review Description Textarea */}
                    <textarea
                        placeholder="Describe your review..."
                        className="w-full p-2 border rounded-lg h-24"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />

                    {/* Image Upload Input */}
                    <input
                        type="file"
                        className="w-full p-2 border rounded-lg"
                        onChange={handleImageUpload}
                    />

                    {/* Email Input with Validation */}
                    <input
                        type="email"
                        placeholder="Your e-mail address"
                        className={`w-full p-2 border rounded-lg ${emailError ? "border-red-500" : "border-gray-300"}`}
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-teal-500 text-white p-3 rounded-lg hover:bg-teal-600 transition duration-200" >
                        Add Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReviewForm;
