import { transactionSchema } from "../schemas/transactionSchema.js";

export async function validateTransactionInput(req, res, next){
    const {transactionType} = req.params;
    const transaction = req.body;

    const {error} = transactionSchema.validate(transaction);
    if(error){
        return res.status(406).send(error.details.map(detail => detail.message));
    }

    if(transactionType !== "inflow" && transactionType !== "outflow") return res.status(400).send("transctionType not valid!"); // TODO: verificar status
    next();
}