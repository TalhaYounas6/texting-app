import asyncHandler from "express-async-handler";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User} = require("../../models/index.cjs");
const {Op} = require("sequelize");
import {TEXTS,STATUS_CODES} from "../../config/constants.js"


export const getUsersFromSidebar = asyncHandler(async(req,res)=>{
    const loggedInUser = req.user.id;

    const users = User.findAll({
        where: {
            id: {
                [Op.ne] : loggedInUser,
            }
        },
        attributes:{exclude:["password"]},
        raw: true,
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message: TEXTS.DATA_FOUND,
        data : users
    })
})