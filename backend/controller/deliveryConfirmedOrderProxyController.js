import axios from "axios";

export const getConfirmedOrdersProxy = async (req, res) => {
  try {
    const token = req.headers.authorization;

    const response = await axios.get("http://localhost:5000/api/orders", {
      headers: { Authorization: token },
    });

    const confirmed = response.data.filter(order => order.status === "Confirmed");
    res.json(confirmed);
  } catch (error) {
    res.status(500).json({ message: "Proxy fetch failed", error: error.message });
  }
};
