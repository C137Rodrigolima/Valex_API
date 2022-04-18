import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export async function performPayment(cardId: number, password: string, businessId: number, amount: number){
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
            message: "could not perform payment with expired card"
        };
    }

    if(!bcrypt.compareSync(password, card.password)){
        throw {
            type: "Unauthorized",
            message: "not authorized"
        };
    }

    const business = await businessRepository.findById(businessId);

    if(!business){
        throw {
            type: "Not Found",
            message: "could not find business"
        }
    }

    if(card.type !== business.type){
        throw{
            type: "Bad Request",
            message: "could not perform payment with diferent type business"
        }
    }

    const cardBalance = await cardRepository.cardBalance(cardId);
    if(cardBalance.balance < amount){
        throw{
            type: "Bad Request",
            message: "could not perform payment with diferent type business"
        }
    }

    await paymentRepository.insert({cardId, businessId, amount});
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