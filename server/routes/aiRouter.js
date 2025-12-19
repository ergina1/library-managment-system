import express from "express";
import {
  isAuthenticated,
  isAuthorized,
} from "../middlewares/authMiddlewares.js";

import {
  askLibrary,
  getRecommendations,
} from "../contollers/aiController.js";

import { chatWithLibrary } from "../contollers/aiController.js";


const router = express.Router();


router.post(
  "/ask",
  isAuthenticated,
  askLibrary
);


router.get(
  "/recommendations",
  isAuthenticated,
  getRecommendations
);

router.post(
  "/chat",
  (req, res, next) => {
    
  },
  chatWithLibrary
);


export default router;
