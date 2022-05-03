import {MongoClient} from "mongodb";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";
import dayjs from "dayjs";
import cors from "cors";
import joi from "joi";

// Server configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.listen(process.env.PORT, () => console.log(chalk.bold.green(`Server online on port ${process.env.PORT}!`)));

// Database configurations
let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect()
.then(() => {
    db = mongoClient.db(process.env.DATABASE);
    console.log(chalk.bold.green("Connected to database!"));
})
.catch((error) => console.log(chalk.bold.red("Could't connet to database!"), error));

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
            registrationDate: dayjs().format('DD/MM/YY - HH:mm:ss')
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
            return res.status(404).send("Email has not been register!");
        }
        const encryptedPassword = await bcrypt.compare(password, userExist.password);
        if(!encryptedPassword){
            return res.status(401).send("Invalid password!");
        }
        res.status(200).send("esse é um token para o usuarios fazer outras req");
    }catch(e){
        console.log("Error on POST /sign-up", e);
        res.sendStatus(500);
    }
});