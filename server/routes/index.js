import express from "express"
import authRoutes from "../controllers/auth/index.js"
import messageRoutes from "../controllers/message/index.js"



const router = express.Router();

router.use(authRoutes);
router.use(messageRoutes);

export default router;