import asyncHandler from "express-async-handler";
import bcrypt, { genSalt } from "bcrypt";
import {STATUS_CODES,TEXTS} from "../../config/constants.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User} = require("../../models/index.cjs");
import {generateJWT} from "../../utils/jwtToken.js"
// import { json } from "sequelize";

export const signup = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;

    const existingUser = await User.findOne({where: {email}, raw:true});
  
    if(existingUser){
        return res.status(STATUS_CODES.CONFLICT).json({
            statusCode : STATUS_CODES.CONFLICT,
            message : "Email is taken."
        })                                             
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const data = await User.create({name,email,password:hashedPassword});
    const newUser = await User.findByPk(data.id,{raw : true});

    if(newUser){
        let token = generateJWT(newUser.id,res)
    }

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode : STATUS_CODES.SUCCESS,
        message : TEXTS.CREATED,
        data
    })

})


export const login = asyncHandler(async(req,res)=>{
    const {password,email} = req.body;

    const user = await User.findOne({where:{email},raw : true});

    if(!user){
        return res.status(STATUS_CODES.NOT_FOUND).json({
            statusCode : STATUS_CODES.NOT_FOUND,
            message : "User does not exist",
        })
    }

    const isPassword = await bcrypt.compare(password,user?.password)

    if(!isPassword){
        res.status(STATUS_CODES.UNAUTHORIZED).json({
            statusCode : STATUS_CODES.UNAUTHORIZED,
            message: "Inavlid credentials",
        })
    }

    let token = generateJWT(user.id,res);

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode : STATUS_CODES.SUCCESS,
        message : TEXTS.LOGIN,
        data : user,
    })



})

export const logout = asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        maxAge: 0,
        httpOnly:true,
        sameSite: "strict",
        secure: process.env.NODE_ENV != "development"
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode: STATUS_CODES.SUCCESS,
        message : "User logged out",
    })
})

export const updateProfile = async(req,res)=>{

}