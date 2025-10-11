import jwt from "jsonwebtoken"

export const generateJWT = (userID,res)=>{

    const token = jwt.sign({userID},process.env.jwtSecretKey,{ expiresIn: "1h"});

    res.cookie("jwt",token,{
        maxAge: 60 * 60 * 1000,
        httpOnly:true,
        sameSite: "none",
        secure: true
    })

    return token;

}

export const verifyJWT = async(token)=>{
    try {
     const decoded =  jwt.verify(token,process.env.jwtSecretKey);
     return {decoded, err:null}
        
    } catch (error) {
        return {decoded:null, err:error}
    }
}