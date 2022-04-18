import { Request, Response } from "express";
import * as cardServices from "../services/cardServices.js";

export async function createCard(req: Request, res: Response) {
    const xApiKey = (req.headers["x-api-key"]) as string;
    const {employeeId, type, virtualCard} = req.body;


    if(!xApiKey || !type || virtualCard === null){
        return res.sendStatus(422);
    }

    const cardTypes = ['groceries', 'restaurant', 'transport', 'education', 'health'];
    if(!cardTypes.includes(type)){
        return res.sendStatus(422);
    }

    await cardServices.addCard(employeeId, type, xApiKey, virtualCard);

    return res.sendStatus(201);
}


export async function activateCard(req: Request, res: Response){
    const { cardId, cardCvv, password } = req.body;

    if(!cardId || !cardCvv || !password){
        return res.sendStatus(422);
    }

    await cardServices.activate(cardId, cardCvv, password);

    return res.sendStatus(200);
}

export async function checkBalance(req: Request, res: Response){
    const {id} = req.body;
    if(!id){
        return res.sendStatus(422);
    }

    const amountRows = await cardServices.getCardBalance(id);
    res.send(amountRows);
}