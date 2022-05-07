import dayjs from "dayjs";
import db from "./../config/db.js"

// Controllers
export async function getTransactions(req, res){

    try{
        const sessionExist = await db.collection("sessions").findOne({token});
        if(!sessionExist) return res.status(401).send("User not signed-in!"); // TODO: verificar status

        const userExist = await db.collection("users").findOne({email: sessionExist.email});
        if(!userExist){
            return res.status(401).send("Email has not been register!");
        }
        
        const userTransactions = await db.collection("transactions").find({ email: userExist.email }).toArray();
        res.status(200).send(userTransactions);
    }catch(e){
        console.log("Error on POST /sign-up", e);
        res.sendStatus(500);
    }
}

export async function postTransactions(req, res){
    const {user} = res.locals;
    const {transactionType} = req.params;
    let {value, description} = req.body;
    value = parseFloat(value);  
 
    const transaction = {
        value,
        description,
        type: transactionType,
        date: dayjs().format('DD/MM'),
        email: user.email
    };

    try{
        await db.collection("transactions").insertOne(transaction);
        res.status(200).send(transaction);
    }catch(e){
        console.log("Error on POST /sign-up", e);
        res.sendStatus(500);
    }
}