import db from "../config/db.js";

export async function validateToken(req, res, next){
    const {authorization} = req.headers;
    if(!authorization) return res.status(401).send("Authorization not found!"); 
    const token = authorization?.replace("Bearer", "").trim();
    if(!token) return res.status(401).send("Token not found!");
    try{
        const sessionExist = await db.collection("sessions").findOne({token});
        if(!sessionExist || !sessionExist.status) return res.status(401).send("User not signed-in!");
        const userExist = await db.collection("users").findOne({email: sessionExist.email});
        if(!userExist) return res.status(401).send("Email has not been register!");

        res.locals.user = userExist;
        next();
    }catch(e){
        console.log("Error on token validation!", e);
        return res.sendStatus(500);
    }
}