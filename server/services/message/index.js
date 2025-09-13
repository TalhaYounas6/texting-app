import asyncHandler from "express-async-handler";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User,Message} = require("../../models/index.cjs");
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

export const getMessagesFromPerson = asyncHandler(async(req,res)=>{

    const {id : userIdToChatWith} = req.params;
    const userId = req.user.id;

    const messages = await Message.findAll({
        where:{
            [Op.or] :[
                {
                    senderId : userIdToChatWith,
                    recieverId : userId
                },
                {
                    senderId : userId,
                    recieverId : userIdToChatWith
                }
            ]
        },
        order:[["createdAt","ASC"]],
        attributes:{exclude :["id"]},
        raw : true
    })

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode : STATUS_CODES.SUCCESS,
        message:TEXTS.DATA_FOUND,
        data : messages
    })
})

export const sendMessages = asyncHandler(async(req,res)=>{

    const { id : receiverId } = req.params;
    const image = req.file;
    const senderId = req.user.id;
    const { text } = req.body;

    if(!text && !image){
        return res.status(STATUS_CODES.REQUIRED).json({
            statusCode : STATUS_CODES.REQUIRED,
            message : "Either a Text or an image is required to send"
        })
    }

    let imgUrl;
    if (image) {
        const base64Image = `data:${image.mimetype};base64,${image.buffer.toString(
        "base64"
        )}`;
    const uploadresponse = await cloudinary.uploader.upload(base64Image);
    imgUrl = uploadresponse.secure_url;
    }

    const message = await Message.create({
        senderId : senderId,
        receiverId : receiverId,
        text,
        image : imgUrl,
    })

    //socket.io implementation here for real time messaging
    //.....

    res.status(STATUS_CODES.SUCCESS).json({
        statusCode : STATUS_CODES.SUCCESS,
        message : TEXTS.CREATED,
        data : message
    })
})