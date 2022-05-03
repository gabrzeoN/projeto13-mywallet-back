import {MongoClient} from "mongodb";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";
import cors from "cors";
import joi from "joi";

// console.log(chalk.bold.green(`Server online on port ${process.env.PORT}`));

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
const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    repeat_password: joi.ref('password')
});
const messageSchema = joi.object({
    from: joi.string().required(),
    to: joi.string().required(),
    text: joi.string().required(),
    type: joi.string().required(),
});

app.post("/sign-up", async (req, res) => {
    const {name, email, password, repeat_password} = req.body;
    const user = req.body;
    
    const {error} = userSchema.validate(user, {abortEarly: false});
    if(error){
        console.log(error.details.map(detail => detail.message)); // TODO: erase me
        return res.status(409).send(error.details.map(detail => detail.message));
        // return res.status(409).send("Nome deve ser string não vazio!");
    }else if(password !== repeat_password){
        return res.status(406).send(`Passwords must be equal!`);
    }
    res.send(200)
    
    // try{
    //     nameAlreadyExist = await db.collection("participants").findOne({name});
    //     if(nameAlreadyExist){
    //         return res.status(409).send("O nome escolhido já existe!");
    //     }

    //     await db.collection("messages").insertOne({
    //         from: name,
    //         to: 'Todos',
    //         text: 'entra na sala...',
    //         type: 'status',
    //         time: dayjs().format('HH:mm:ss')
    //     });
        
    //     await db.collection("participants").insertOne({name, lastStatus: Date.now()});
    //     res.sendStatus(201);
    // }catch(e){
    //     console.log("Error on POST /participants", e);
    //     res.sendStatus(500);
    // }
});

app.post("/participants", async (req, res) => {
    const {name} = req.body;
    let nameAlreadyExist = [];
    
    const validation = userSchema.validate({name}, {abortEarly: false});
    if(validation.error){
        console.log(validation.error.details.map(detail => detail.message)); // TODO: erase me
        return res.status(422).send("Nome deve ser string não vazio!");
    }
    
    try{
        nameAlreadyExist = await db.collection("participants").findOne({name});
        if(nameAlreadyExist){
            return res.status(409).send("O nome escolhido já existe!");
        }

        await db.collection("messages").insertOne({
            from: name,
            to: 'Todos',
            text: 'entra na sala...',
            type: 'status',
            time: dayjs().format('HH:mm:ss')
        });
        
        await db.collection("participants").insertOne({name, lastStatus: Date.now()});
        res.sendStatus(201);
    }catch(e){
        console.log("Error on POST /participants", e);
        res.sendStatus(500);
    }
});