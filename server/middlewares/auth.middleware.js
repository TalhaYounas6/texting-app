import {verifyJWT} from "../utils/jwtToken.js";
import {STATUS_CODES,TEXTS} from "../config/constants.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {User} = require("../models/index.cjs");

export const protectedRoute = async(req,res,next)=>{

    try {
        
        const token = req.cookies.jwt;
        console.log("Token in protected route: ",token);
        
        if(!token){
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                statusCode : STATUS_CODES.UNAUTHORIZED,
                message : TEXTS.NO_AUTH_GIVEN,
            })
        }
    
        const result = await verifyJWT(token);
        if(result.err){
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                statusCode : STATUS_CODES.UNAUTHORIZED,
                message : TEXTS.INVALID_AUTH_TOKEN,
            })
        } else{
            const user = await User.findByPk(result.decoded.userID,{
                attributes : {
                    exclude: ["password"]
                }
            });
    
            req.user = user;
            console.log(user);
            next();
        }
    } catch (error) {
        console.log("Error in protectedRoute middleware: ",error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            statusCode : STATUS_CODES.INTERNAL_SERVER_ERROR,
            message : "Internal Servor Error"
        })
    }

}