import express from "express";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const upload = multer();

const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
const CLARIFAI_USER_ID = process.env.CLARIFAI_USER_ID;
const CLARIFAI_APP_ID = process.env.CLARIFAI_APP_ID;
const CLARIFAI_WORKFLOW_ID = process.env.CLARIFAI_WORKFLOW_ID;

router.post("/validate-image", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    console.log("CLARIFAI CONFIG", {
        CLARIFAI_API_KEY: process.env.CLARIFAI_API_KEY,
        CLARIFAI_USER_ID: process.env.CLARIFAI_USER_ID,
        CLARIFAI_APP_ID: process.env.CLARIFAI_APP_ID,
        CLARIFAI_WORKFLOW_ID: process.env.CLARIFAI_WORKFLOW_ID,
      });
      
      
    const clarifaiRes = await axios.post(
      `https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/workflows/${CLARIFAI_WORKFLOW_ID}/results`,
      {
        inputs: [
          {
            data: {
              image: { base64: base64Image },
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Key ${CLARIFAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(clarifaiRes.data);
  } catch (error) {
    console.error("Clarifai error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Clarifai validation failed.",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
