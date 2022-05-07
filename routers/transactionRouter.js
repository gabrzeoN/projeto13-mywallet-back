import {Router} from "express";
import {getTransactions, postTransactions} from "./../controllers/transactionController.js";
import {validateToken} from "./../middwares/tokenValidationMiddware.js";
import {validateTransactionInput} from "./../middwares/transactionInputValidationMiddware.js";

const transactionRouter = Router();
transactionRouter.use(validateToken);

transactionRouter.get("/transaction", getTransactions);
transactionRouter.post("/transaction/:transactionType", validateTransactionInput, postTransactions);

export default transactionRouter;