import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, Trash2, MessageCircle, XCircle } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
      alert("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review.");
    }
  };

  const handleReplySubmit = async () => {
    const badWords = ["stupid", "idiot", "fool", "nonsense", "dumb", "trash", "loser", "moron", "bastard", "sucker", "crap", "shit", "fuck", "ass", "bitch", "damn", "retard", "piss", "dick", "cock", "slut", "whore", "cunt", "prick","wtf", "fml", "fk", "stfu", "omfg", "gtfo", "suckmydick",
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

  "huththo","pakaya","wesi","hukapan","balli","pakaya","huththi","kariya","huththige putha",
  "ponnaya","kari","puka", "kunu", "ballek", "gon", "harupa", "modaya", "yakadaya", "pissu",
   "kunu", "kunu harupa", "yakko", "moda", "gon", "baya", "paraya",
  "mala", "muhuda", "uththare", "gembek", "harupa", "buruwa", "uruma",
  "ethakota umba", "harak", "magema amma", "kariya", "huththi", "puka",
  "kudda", "thaniya", "kalakanni", "wehi", "siyalu", "pakaya", "thadiya",
  "sudu akka", "gon haraka", "thadi amma", "heena", "ethuma", "kurutta",
  "mara pissu", "saththu", "yanna", "yanna pissu", "gona", "unna", "uda",
  "umbata", "tho", "thopi","bijja","lodaya","wesa","lolla"
  ];
    const replyTextLower = replyModal.replyText.toLowerCase();
    const found = badWords.find(word => replyTextLower.includes(word));
    if (found) {
      alert("Your reply contains inappropriate language.");
      return;
    }

    try {
      const aiRes = await axios.post(
        `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyDDWGVW_1loLyHNEvW3bBeQIrMV_rGnBqQ`,
        {
          comment: { text: replyModal.replyText },
          languages: ["en"],
          requestedAttributes: { TOXICITY: {} }
        }
      );
      const score = aiRes.data.attributeScores.TOXICITY.summaryScore.value;
      if (score >= 0.7) {
        alert("Your reply was detected as inappropriate by AI.");
        return;
      }
    } catch (err) {
      console.warn("AI check failed, continuing without it.");
    }

    try {
      await axios.post(`http://localhost:5000/api/reviews/reply/${replyModal.review._id}`, {
        reply: replyModal.replyText,
      });
      setReplyModal({ open: false, review: null, replyText: "" });
      fetchReviews();
      alert("Reply submitted successfully!");
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Failed to submit reply.");
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Ceylon Flavours - Review Report", 14, 22);

    const date = new Date();
    const formattedDate = date.toLocaleDateString();
    doc.setFontSize(11);
    doc.text(`Date: ${formattedDate}`, 14, 30);

    const tableColumn = ["No", "Title", "Rating", "Email", "Review", "Reply"];
    const tableRows = [];

    filteredReviews.forEach((review, index) => {
      tableRows.push([
        index + 1,
        review.title,
        review.rating,
        review.email,
        review.review,
        review.reply || "No reply",
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      theme: "striped",
      headStyles: { fillColor: [22, 160, 133] },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
    }

    doc.save("review_report.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 flex flex-col">
      <div className="w-full mx-auto p-6 bg-purple-200 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Review Management</h1>

        <div className="text-center mb-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-lg w-full md:w-1/2"
          />
        </div>

        <div className="text-center mb-4">
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

        <div className="text-center mb-6">
          <button
            onClick={handleExportPDF}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Download PDF Report
          </button>
        </div>

        {filteredReviews.length === 0 ? (
          <p className="text-gray-600 text-center">No reviews available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                {review.image && (
                  <img
                    src={`http://localhost:5000/upload/${review.image}`}
                    alt="Review"
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                )}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{review.title}</h3>
                <p className="text-gray-600 mb-2">{review.review}</p>
                <p className="text-gray-500 text-sm">{review.email}</p>
                <p className="text-gray-400 text-xs mt-1">Added on: {new Date(review.createdAt).toLocaleString()}</p>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                    />
                  ))}
                </div>
                {review.reply && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-md">
                    <p className="text-sm text-gray-600">
                      <strong>Reply:</strong> {review.reply}
                    </p>
                  </div>
                )}
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
