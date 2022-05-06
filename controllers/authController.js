import bcrypt from "bcrypt";
import dayjs from "dayjs";
import db from "./../config/db.js"
import {v4 as uuid} from "uuid";
import joi from "joi";

// Joi schemas
const signUpSchema = joi.object({
    name: joi.string().trim().required(),
    email: joi.string().trim().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: joi.required().valid(joi.ref('password'))
});
const signInSchema = joi.object({
    email: joi.string().trim().email().required(),
    password: joi.string().required()
});

// Controllers
export async function signUp(req, res){
    const {name, email, password, repeat_password} = req.body;
    const user = req.body;
    
    const {error} = signUpSchema.validate(user, {abortEarly: false});
    if(error){
        return res.status(406).send(error.details.map(detail => detail.message));
    }
    try{
        const userAlreadyExist = await db.collection("users").findOne({email});
        if(userAlreadyExist){
            return res.status(409).send("Email has already been register!");
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        await db.collection("users").insertOne({
            name,
            email,
            password: encryptedPassword,
            registrationTime: dayjs().format('HH:mm:ss'),
            registrationDate: dayjs().format('DD/MM/YY')
        });
        res.sendStatus(201);
    }catch(e){
        console.log("Error on POST /sign-up", e);
        res.sendStatus(500);
    }
}

export async function signIn(req, res){
    const {email, password} = req.body;
    const user = req.body;
    
    const {error} = signInSchema.validate(user, {abortEarly: false});
    if(error){
        return res.status(406).send(error.details.map(detail => detail.message));
    }
    try{
        const userExist = await db.collection("users").findOne({email});
        if(!userExist){
            return res.status(404).send("Email has not yet been register!");
        }
        const correctPassword = await bcrypt.compare(password, userExist.password);
        if(!correctPassword){
            return res.status(401).send("Invalid password!");
        }

        const token = uuid();
        await db.collection("sessions").insertOne({
            email,
            token,
            time: dayjs().format('HH:mm:ss'),
            date: dayjs().format('DD/MM/YY'),
            lastStatus: Date.now()
        });
        res.status(200).send(token);
    }catch(e){
        console.log("Error on POST /sign-up", e);
        res.sendStatus(500);
    }
}