import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.put("/read", protectRoute, markAsRead);

export default router;
