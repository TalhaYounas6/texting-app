import asyncHandler from "express-async-handler";
import bcrypt, { genSalt } from "bcrypt";
import {STATUS_CODES,TEXTS} from "../../config/constants.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User} = require("../../models/index.cjs");
import {generateJWT} from "../../utils/jwtToken.js"
import { json } from "sequelize";

export const signup = asyncHandler(async(req,res)=>{
    const {fullName,email,password} = req.body;

    const existingUser = await User.findOne({where: {email}, raw:true});

    if(existingUser){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode : STATUS_CODES.CONFLICT,
            message : "Email is taken."
        })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const data = await User.Create({fullName,email,password:hashedPassword});
    const newUser = await User.findByPk(data.id,{raw : true});

    if(newUser){
        let token = generateJWT(newUser.id,res)
    }

    res.status(STATUS_CODES.SUCCESS),json({
        statusCode : STATUS_CODES.SUCCESS,
        message : TEXTS.CREATED,
        data
    })

})


export const login = asyncHandler(async(req,res)=>{
    
})