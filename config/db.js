import {MongoClient} from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URI);
try{
    await mongoClient.connect()
    db = mongoClient.db(process.env.DATABASE);
    console.log(chalk.bold.green("Connected to database!"));
}catch(error){
    console.log(chalk.bold.red("Could't connet to database!"), error)
}

export default db;