import express from "express";
import {upload} from "../../utils/multer.js"
import * as messageServices from "../../services/message/index.js"
import {protectedRoute} from "../../middlewares/auth.middleware.js"

const router = express.Router();

router.get('/users',protectedRoute,messageServices.getUsersFromSidebar)



export default router;