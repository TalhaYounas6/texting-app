import express from "express";
import * as authServices from "../../services/auth/index.js";
import {userSchema} from "../../middlewares/userSchema.js";
import {validateInput} from "../../middlewares/validator.js";
import {protectedRoute} from "../../middlewares/auth.middleware.js"

const router = express.Router();

router.post('/auth/signup',validateInput(userSchema),authServices.signup);
router.post('/auth/login',authServices.login);
router.post('/auth/logout',authServices.logout)
router.put('/auth/updateProfile',authServices.updateProfile)


export default router;