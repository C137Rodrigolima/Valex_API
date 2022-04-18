import { NextFunction, Request, Response } from "express";

export async function handleErrorMiddleware(
    error: any,
    req: Request, 
    res: Response, 
    next: NextFunction
){
    if(error.type === "Bad Request"){
        return res.sendStatus(400);
    }
    if(error.type === "Not Found"){
        return res.sendStatus(404);
    }
    if(error.type === "Conflict"){
        return res.sendStatus(409);
    }
    if(error.type === "Unauthorized"){
        return res.sendStatus(401);
    }

    console.log(error);
    return res.sendStatus(500);
}