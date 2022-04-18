import { Request, Response } from "express";
import * as paymentServices from "../services/paymentServices.js";

export async function paymentInPos(req: Request, res: Response){
    const {cardId, password, businessId, amount} = req.body;

    if(!cardId || !password || !businessId || !amount || amount <= 0){
        return res.sendStatus(422);
    }

    await paymentServices.performPayment(cardId, password, businessId, amount);

    res.sendStatus(200);
}