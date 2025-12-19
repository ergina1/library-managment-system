import express from "express";
import {
    getAllUsers,
    registerNewAdmin,
} from "../contollers/userController.js";
import {
    isAuthenticated,
    isAuthorized,
} from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

export default router;