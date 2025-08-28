import express from "express"
import authRoutes from "../controllers/auth/index.js"




const router = express.Router();

router.use(authRoutes);
// router.use(userRoutes);

export default router;