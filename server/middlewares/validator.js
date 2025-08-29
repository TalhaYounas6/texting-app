import {STATUS_CODES} from "../config/constants.js"

export const validateInput = (schema)=>{ 

return (req,res,next)=>{
    const {error} = schema.validate(req.body);

    if(error){
        return res.status(STATUS_CODES.REQUIRED).json({
            statusCode: STATUS_CODES.REQUIRED,
            message : error.details[0].message,
        })
    }

    next();
}
}
