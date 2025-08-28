import express from "express";
import * as authServices from "../../services/auth/index.js"

const router = express.Router();

router.post('/auth/signup',authServices.signup);


export default router;