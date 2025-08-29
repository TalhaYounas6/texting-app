import express from "express";
import * as authServices from "../../services/auth/index.js";
import {userSchema} from "../../middlewares/userSchema.js";
import {validateInput} from "../../middlewares/validator.js"

const router = express.Router();

router.post('/auth/signup',validateInput(userSchema),authServices.signup);


export default router;