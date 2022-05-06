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
import {signIn, signUp} from "./../controllers/authController.js";

// Server configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT, () => console.log(chalk.bold.green(`Server online on port ${process.env.PORT}!`)));

// Joi schemas
const transactionSchema = joi.object({
    value: joi.number().required(),
    description: joi.string().trim().required()
});

app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.get("/transaction", async (req, res) => {
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

    res.sendStatus(200)
});

app.post("/transaction/:transactionType", async (req, res) => {
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

    res.sendStatus(200)
});

// valor, descricao, dia 30/11