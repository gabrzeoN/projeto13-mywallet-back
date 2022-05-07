import {Router} from "express";
import {signIn, signUp, signOut} from "./../controllers/authController.js";
import { validateToken } from "../middwares/tokenValidationMiddware.js";
const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.put("/sign-out", validateToken, signOut);

export default authRouter;