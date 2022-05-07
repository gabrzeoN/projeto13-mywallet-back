import express, {json} from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import authRouter from "../routers/authRouter.js";
import transactionRouter from "./../routers/transactionRouter.js";

// Server configurations
dotenv.config();
const app = express();
app.use(cors());
app.use(json());

// Routers
app.use(authRouter);
app.use(transactionRouter);

app.listen(process.env.PORT, () => 
    console.log(chalk.bold.green(`Server online on port ${process.env.PORT}!`))
);