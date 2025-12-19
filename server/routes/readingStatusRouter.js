import express from "express";
import {
  getMyReadingStatusForBook,
  getMyReadingStatuses,
  updateMyReadingStatus,
  deleteMyReadingStatus,
} from "../contollers/readingStatusController.js";
import { isAuthenticated } from "../middlewares/authMiddlewares.js";

const router = express.Router();



router.get("/me", isAuthenticated, getMyReadingStatuses);


router.get("/book/:bookId", isAuthenticated, getMyReadingStatusForBook);


router.put("/book/:bookId", isAuthenticated, updateMyReadingStatus);


router.delete("/book/:bookId", isAuthenticated, deleteMyReadingStatus);

export default router;
