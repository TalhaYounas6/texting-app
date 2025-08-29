import JOI from "joi";

export const userSchema = JOI.object({
    name : JOI.string().min(3).required().messages({
        "string.empty" : "Name is required",
        "any.required" : "Name is required",
    }),
    email : JOI.string().email().required().messages({
        "email.empty" : "Email is required",
        "string.empty" : "Email is required",
        "any.required" : "Email is required",
    }),
    password : JOI.string().min(6).required().messages({
        "string.empty" : "String is required",
        "string.min"   : "Password must be 6 digits/letters long",
        "any.required" : "String is required",
    })
})