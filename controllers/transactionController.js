import dayjs from "dayjs";
import db from "./../config/db.js"

// Controllers
export async function getTransactions(req, res){
    const {user} = res.locals;
    try{   
        const userTransactions = await db.collection("transactions").find({ email: user.email }).toArray();
        userTransactions.forEach(transaction => {
            delete transaction._id
            delete transaction.email
        });
        res.status(200).send(userTransactions);
    }catch(e){
        console.log("Error on GET /transaction", e);
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
        res.sendStatus(201);
    }catch(e){
        console.log("Error on POST /transaction/:transactionType", e);
        res.sendStatus(500);
    }
}