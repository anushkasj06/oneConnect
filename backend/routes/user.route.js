import express  from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSuggestConnections, getPublicProfile , updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/suggestions",protectRoute,getSuggestConnections);
router.get("/:username",protectRoute,getPublicProfile);
router.put("/profile",protectRoute,updateProfile);

export default router;