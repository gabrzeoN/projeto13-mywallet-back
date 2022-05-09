import joi from "joi";

export const signUpSchema = joi.object({
    name: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeatPassword: joi.required().valid(joi.ref('password'))
});

export const signInSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().required()
});