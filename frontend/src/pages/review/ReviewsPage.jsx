import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingReview, setEditingReview] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedReview, setUpdatedReview] = useState("");
  const [updatedRating, setUpdatedRating] = useState(0);
  const [updatedImage, setUpdatedImage] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const navigate = useNavigate();

  const badWords = [
    "badword1", "badword2", "stupid", "idiot", "fool", "nonsense",
    "dumb", "trash", "loser", "moron", "bastard", "sucker", "silly",
    "crap", "screw", "shit", "fuck", "fucking", "ass", "asshole",
    "bitch", "damn", "bloody", "retard", "piss", "dick", "cock",
    "pussy", "slut", "whore", "hell", "suck", "jerk", "motherfucker",
    "son of a bitch", "bullshit", "arse", "wanker", "cunt", "prick",
    "wtf", "fml", "fk", "stfu", "omfg", "gtfo", "suckmydick",
    "pissu", "kunu", "yakko", "harupa", "gahala maranawa", "hema hora",

   
  "nutjob", "twat", "bugger", "bollocks", "numbnuts", "shitface",
  "dipshit", "numbnut", "shithole", "shitbag", "scumbag",
  "douchebag", "jackass", "pisshead", "asswipe", "fuckhead",
  "fuckface", "shitfaced", "dumbfuck", "cockhead", "bastardo",
  "skank", "hoe", "scrote", "fuckwad", "fuckstick", "shitstick",
  "jerkwad", "twatwaffle", "assclown", "fuckhole", "balllicker",
  "shitstain", "cocksucker", "shitbrain", "cumdumpster",
  "fag", "faggot", "tranny", "queer", "dyke", "gaylord",
  "kunt", "twit", "pecker", "wang", "schlong", "douche",
  "knob", "arsewipe", "tard", "mong", "beaner", "spic",
  "chink", "gook", "paki", "camel jockey", "towelhead",
  "sandnigger", "nigga", "nigger", "negro", "coon", "darkie",
  "cracker", "redneck", "hillbilly", "wetback", "gringo",
  "retarded", "cripple", "invalid", "fatass", "lardass",
  "fatso", "chunky", "blubber", "ugly", "minger", "slapper",
  "dickhead", "arsehole", "shithead", "fucktard", "bitchass",
  "fuckboy", "fucker", "arseface", "dipshit", "pissface",
  "assmaster", "goddamn", "shitload", "fuckload", "buttfuck",
  "ballbag", "cuntface", "pissflaps", "fucknugget",
  "shitlord", "pisspants", "cockmuncher", "fuckmuppet",
  "cumbubble", "jizz", "jizzmopper", "dickweed", "cumstain",
  "pissbucket", "fuckface", "shitlicker", "asshat",
  "fuckmeat", "shitweasel", "fucktard", "dumbass",
  "twatwaffle", "fudgewagon", "shart", "shitter",
  "dickless", "cockmongler", "assboner", "cockbite",
  "shitstorm", "pussbucket", "ballsack", "knobhead",
  "fartknocker", "shitbird", "pissrat", "pissmonger",
  "scumbucket", "nutlicker", "shitpile", "cocknose",
  "shitbreath", "fuckbucket", "fudgewit", "twatwaffle",
  "shitpants", "assdouche", "bastardface", "cuntbag",
  "asscock", "fuckyourself", "cocksmoker", "pisslord",
  "shitmouth", "pissdrinker", "cocksnot", "asscrack",
  "fuckwagon", "dickwagon", "arsecrumpet", "knobjockey",
  "cockwaffle", "arsemonkey", "pissclown", "cumrocket",
  "shithouse", "dickbrains", "cocknugget", "fuckbiscuit",
  "arsegremlin", "fuckwhistle", "knobgoblin", "cumguzzler",
  "shitgibbon", "cockwomble", "fucktwit", "cockwrench",
  "douchecanoe", "knobjob", "fuckwhit", "shitlord",
  "cumbucket", "twatstick", "arsepimple", "fuckplank",
  "shitmuffin", "arsewizard", "asspirate", "fuckpuddle",
  "cockslap", "fucktangle", "shitface", "bollockhead",
  "arselicker", "cocksplat", "fucksprout", "shitshovel",
  "knobmonkey", "shitsplat", "twatsplat", "twatdangle",

  "huththo","pakaya","wesi","hukapan","balli","pakaya","huththi","kariya","huththige putha","ponnaya","kari","puka","huththo","pakaya","wesi","hukapan","balli","pakaya","huththi","kariya","huththige putha",
  "ponnaya","kari","puka", "kunu", "ballek", "gon", "harupa", "modaya", "yakadaya", "pissu",
   "kunu", "kunu harupa", "yakko", "moda", "gon", "baya", "paraya",
  "mala", "muhuda", "uththare", "gembek", "harupa", "buruwa", "uruma",
  "ethakota umba", "harak", "magema amma", "kariya", "huththi", "puka",
  "kudda", "thaniya", "kalakanni", "wehi", "siyalu", "pakaya", "thadiya",
  "sudu akka", "gon haraka", "thadi amma", "heena", "ethuma", "kurutta",
  "mara pissu", "saththu", "yanna", "yanna pissu", "gona", "unna", "uda",
  "umbata", "tho", "thopi","bijja","lodaya","wesa","lolla"
  
  ];

  useEffect(() => {
    fetchReviews();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setUserEmail(userObj.email);
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      setReviews(response.data);
      setFilteredReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this review?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
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

  const handleEditClick = (review) => {
    if (!userEmail) {
      alert("You must be logged in to edit reviews.");
      return;
    }
    setEditingReview(review._id);
    setUpdatedTitle(review.title);
    setUpdatedReview(review.review);
    setUpdatedRating(review.rating);
    setUpdatedImage(null);
  };

  const containsBadWords = (text) => {
    const lower = text.toLowerCase();
    return badWords.some((word) => lower.includes(word));
  };

  const handleImageChange = (event) => {
    setUpdatedImage(event.target.files[0]);
  };

  const handleUpdate = async () => {
    if (containsBadWords(`${updatedTitle} ${updatedReview}`)) {
      alert("Inappropriate language detected in your edited review.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", updatedTitle);
      formData.append("review", updatedReview);
      formData.append("rating", updatedRating);
      if (updatedImage) {
        formData.append("image", updatedImage);
      }
      await axios.put(`http://localhost:5000/api/reviews/${editingReview}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchReviews();
      setEditingReview(null);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-8" style={{ backgroundImage: "url('/ReviewPageBackground.jpg')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" }}>
      <div className="w-full max-w-5xl mx-auto p-6 bg-white bg-opacity-90 shadow-lg rounded-lg flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Customer Reviews</h1>

        <div className="text-center mb-6">
          <input type="text" placeholder="Search by title..." value={searchQuery} onChange={handleSearch} className="p-2 border border-gray-300 rounded-lg w-full md:w-1/2" />
        </div>

        {userEmail && (
          <div className="text-center mb-6">
            <button onClick={() => navigate("/reviewform")} className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">Add Review</button>
          </div>
        )}

        <div className="text-center mb-6">
          {["1", "2", "3", "4", "5", "All"].map((category) => (
            <button key={category} className={`m-1 px-4 py-2 text-white rounded-lg ${selectedCategory === category ? "bg-blue-700" : "bg-blue-500"} hover:bg-blue-600`} onClick={() => handleCategoryClick(category)}>
              {category === "All" ? "All Ratings" : `${category} Stars`}
            </button>
          ))}
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-gray-600 text-center">No reviews available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                {editingReview === review._id && userEmail === review.email ? (
                  <>
                    <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} className="w-full p-2 border rounded-lg mb-2" />
                    <textarea value={updatedReview} onChange={(e) => setUpdatedReview(e.target.value)} className="w-full p-2 border rounded-lg h-24 mb-2" />
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={20} className={`cursor-pointer mx-1 ${star <= updatedRating ? "text-yellow-500" : "text-gray-300"}`} onClick={() => setUpdatedRating(star)} />
                      ))}
                    </div>
                    {review.image && !updatedImage && (
                      <img src={`http://localhost:5000/upload/${review.image}`} alt="Review" className="w-full h-40 object-cover rounded-md mb-2" />
                    )}
                    <input type="file" onChange={handleImageChange} className="w-full p-2 border rounded-lg mb-2" />
                    <button onClick={handleUpdate} className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">Update Review</button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{review.title}</h3>
                    <p className="text-gray-600 mb-2">{review.review}</p>
                    <p className="text-gray-500 text-sm">{review.email}</p>
                    <p className="text-gray-400 text-xs">{formatDate(review.createdAt)}</p>
                    <div className="flex mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={20} className={star <= review.rating ? "text-yellow-500" : "text-gray-300"} />
                      ))}
                    </div>
                    {review.image && (
                      <img src={`http://localhost:5000/upload/${review.image}`} alt="Review" className="w-full h-40 object-cover rounded-md mb-2" />
                    )}
                    {review.reply && (
                      <div className="mt-2 p-2 bg-gray-100 rounded-md">
                        <p className="text-sm text-gray-600"><strong>Reply:</strong> {review.reply}</p>
                      </div>
                    )}
                    {review.email === userEmail && (
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => handleEditClick(review)} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">Edit Review</button>
                        <button onClick={() => handleDelete(review._id)} className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">Delete</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;
