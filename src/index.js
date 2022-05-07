import {MongoClient} from "mongodb";
import express, {json} from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import chalk from "chalk";
import dayjs from "dayjs";
import cors from "cors";
import joi from "joi";
import db from "./../config/db.js"
import {v4 as uuid} from "uuid";
import authRouter from "../routers/authRouter.js";
import transactionRouter from "./../routers/transactionRouter.js";

// Server configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(json());
app.listen(process.env.PORT, () => console.log(chalk.bold.green(`Server online on port ${process.env.PORT}!`)));

app.use(authRouter);
app.use(transactionRouter);

// app.get("/transaction", getTransactions);
// app.post("/transaction/:transactionType", postTransactions);

// valor, descricao, dia 30/11