import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import dayjs from "dayjs";

export async function insertRecharge(cardId: number, amount: number){
    const card = await cardRepository.findById(cardId);

    if(!card){
        throw {
            type: "Not Found",
            message: "could not find card"
        }
    }

    const expired = compareDate(card.expirationDate);

    if(expired){
        throw {
            type: "Bad Request",
            message: "could not activate expired card"
        };
    }

    await rechargeRepository.insert({ cardId, amount })
}

function compareDate(date: string){
    const expirationDate = date.split("/")
    const actualDate = dayjs().format("MM/YY").split("/");

    if(parseInt(expirationDate[1])< parseInt(actualDate[1])){
        return true;
    } else if(
        parseInt(expirationDate[1]) == parseInt(actualDate[1]) 
        && 
        parseInt(expirationDate[0])<= parseInt(actualDate[0])
    ){
        return true;
    } else{
        return false;
    }
}