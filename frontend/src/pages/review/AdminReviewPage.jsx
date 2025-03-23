import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, MessageCircle, XCircle } from "lucide-react";


function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [replyModal, setReplyModal] = useState({ open: false, review: null, replyText: "" });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      if (Array.isArray(response.data)) {
        setReviews(response.data);
        setFilteredReviews(response.data);
      } else {
        console.error("Invalid data format: Expected an array");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterReviews(event.target.value, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterReviews(searchQuery, category);
  };

  const filterReviews = (query, category) => {
    let filtered = reviews.filter((review) =>
      review.title.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "All") {
      filtered = filtered.filter((review) => review.rating === parseInt(category));
    }
    setFilteredReviews(filtered);
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`);
      setReviews(reviews.filter((review) => review._id !== reviewId));
      setFilteredReviews(filteredReviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleReplySubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/reviews/reply/${replyModal.review._id}`, {
        reply: replyModal.replyText,
      });
      setReplyModal({ open: false, review: null, replyText: "" });
      fetchReviews();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col">
      <div className="w-full mx-auto p-6 bg-purple-200 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Review Management</h1>

        {/* Search Bar */}
        <div className="text-center mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-lg w-full md:w-1/2"
          />
        </div>

        {/* Category Filter */}
        <div className="text-center mb-6">
          {["1", "2", "3", "4", "5", "All"].map((category) => (
            <button
              key={category}
              className={`m-1 px-4 py-2 text-white rounded-lg ${
                selectedCategory === category ? "bg-blue-700" : "bg-blue-500"
              } hover:bg-blue-600`}
              onClick={() => handleCategoryClick(category)}
            >
              {category === "All" ? "All Ratings" : `${category} Stars`}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <p className="text-gray-600 text-center">No reviews available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                {/* User Image */}
                {review.image && (
                  <img
                    src={`http://localhost:5000/upload/${review.image}`}
                    alt="Review"
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}

                {/* Review Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{review.title}</h3>

                {/* Review Comment */}
                <p className="text-gray-600 mb-2">{review.review}</p>

                {/* Email */}
                <p className="text-gray-500 text-sm">{review.email}</p>

                {/* Star Rating */}
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>

                {/* Admin Actions */}
                <div className="mt-4 flex justify-between">
                  <button
                    className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={() => setReplyModal({ open: true, review, replyText: "" })}
                  >
                    <MessageCircle size={16} className="mr-2" /> Reply
                  </button>

                  <button
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    onClick={() => handleDelete(review._id)}
                  >
                    <Trash2 size={16} className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Reply to Review</h2>
            <textarea
              className="w-full p-2 border rounded-lg"
              placeholder="Write your reply..."
              value={replyModal.replyText}
              onChange={(e) => setReplyModal({ ...replyModal, replyText: e.target.value })}
            />
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2 hover:bg-gray-500"
                onClick={() => setReplyModal({ open: false, review: null, replyText: "" })}
              >
                <XCircle size={16} className="mr-2" /> Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={handleReplySubmit}
              >
                Submit Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReviewPage;
