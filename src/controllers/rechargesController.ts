import { Request, Response } from "express";
import * as rechargeServices from "../services/rechargeServices.js";

export async function rechargeCard(req: Request, res: Response){
    const {id, amount} = req.body;

    if(!id || amount <= 0){
        return res.sendStatus(422);
    }

    await rechargeServices.insertRecharge(id, amount);

    res.sendStatus(201);
}