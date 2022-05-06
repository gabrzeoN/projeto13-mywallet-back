import {MongoClient} from "mongodb";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";
import dayjs from "dayjs";
import cors from "cors";
import joi from "joi";
import db from "./../config/db.js"
import {v4 as uuid} from "uuid";

// Server configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT, () => console.log(chalk.bold.green(`Server online on port ${process.env.PORT}!`)));

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
const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().trim().required()
});

app.post("/sign-up", async (req, res) => {
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
});

app.post("/sign-in", async (req, res) => {
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
});

// // Feito no onibus
// app.get("/transaction", async (req, res) => {
//     const {authorization} = req.headers;
//     //validar token

//     const token = authorization?.replace("Bearer", "").trim();
//     if(!authorization) return res.status(400).send("Authorization not found!"); // TODO: verificar status

//     if(!token) return res.status(400).send("Token not found!"); // TODO: verificar status


//     try{
//         const sessionExist = await db.collection("sessions").findOne({token});
//         if(!sessionExist) return res.status(400).send("User not signed-in!"); // TODO: verificar status

//         const userExist = await db.collection("users").findOne({email: sessionExist.email});
//         if(!userExist){
//             return res.status(404).send("Email has not been register!");
//         }
        
//         const userTransactions = await db.collection("transactions").find({ email: userExist.email }).toArray();
//         res.status(200).send(userTransactions);
//     }catch(e){
//         console.log("Error on POST /sign-up", e);
//         res.sendStatus(500);
//     }
// });

// app.post("/transaction/:transactionType", async (req, res) => {
//     const {transactionType} = req.params;
//     const {authorization} = req.headers;
//     const transaction = req.body;
//     let {value, description} = req.body;
//     value = parseFloat(value);

//     //validar token
//     const token = authorization?.replace("Bearer", "").trim();
//     if(!authorization) return res.status(400).send("Authorization not found!"); // TODO: verificar status

//     if(!token) return res.status(400).send("Token not found!"); // TODO: verificar status
//     const {error} = transactionSchema.validate(transaction);
//     if(error){
//         return res.status(406).send(error.details.map(detail => detail.message));
//     }

//     if(transactionType !== "inflow" && transactionType !== "outflow") return res.status(400).send("transctionType not valid!"); // TODO: verificar status

//     try{
//         const sessionExist = await db.collection("sessions").findOne({token});
//         if(!sessionExist) return res.status(400).send("User not signed-in!"); // TODO: verificar status

//         const userExist = await db.collection("users").findOne({email: sessionExist.email});
//         if(!userExist){
//             return res.status(404).send("Email has not been register!");
//         }
    
//         if(transactionType === "inflow"){
//             await db.collection("transactions").insertOne({ value, description, date: dayjs().format('DD/MM'), email: userExist.email });
//         }else if(transactionType === "outflow"){
//             await db.collection("transactions").insertOne({ value: (value * -1), description, date: dayjs().format('DD/MM'), email: userExist.email });
//         }
//         res.status(200).send(userTransactions);
//     }catch(e){
//         console.log("Error on POST /sign-up", e);
//         res.sendStatus(500);
//     }
// });

// valor, descricao, dia 30/11