import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import { faker } from '@faker-js/faker';

export async function addCard(employeeId: number, type: cardRepository.TransactionTypes, apiKey: string, virtualCard: boolean){
    const existentCompany = await companyRepository.findByApiKey(apiKey);
    if(!existentCompany){
        throw {
            type: "Not Found", 
            message: "could not found company with API key"
        };
    }
    const existentEmployee = await employeeRepository.findById(employeeId);

    if(!existentEmployee){
        throw {
            type: "Not Found", 
            message: "could not found company with API key"
        };
    }

    const multipliTypeCardstoEmployee = await cardRepository.findByTypeAndEmployeeId(type, employeeId);

    if(!multipliTypeCardstoEmployee){
        throw {
            type: "Conflict", 
            message: "Card type already being used"
        };
    }

    const cardNumber = faker.finance.creditCardNumber('mastercard');

    const employeeCardName = crateCardName(existentEmployee.fullName);

    const expDateCard = createDataExpiration();

    const cvvCardNumber = faker.finance.creditCardCVV();
    const cvvCardNumberHash = bcrypt.hashSync(cvvCardNumber, 10);

    await cardRepository.insert({
        employeeId: employeeId,
        number: cardNumber,
        cardholderName: employeeCardName,
        securityCode: cvvCardNumberHash,
        expirationDate: expDateCard,
        password: null,
        isVirtual: virtualCard,
        originalCardId: null,
        isBlocked: false,
        type: type,
    });
}

function createDataExpiration(){
    const actualday = dayjs()
    const expirationDay = actualday.clone().add(5, 'year')
    return expirationDay.format("MM/YY");
}

function crateCardName(fullName: string) {
    const arrName = fullName.split(" ");
    let cardName = [];

    for(let i=0; i<arrName.length; i++){
        if(i===0 || i=== (arrName.length-1)){
            cardName.push(arrName[i]);
        } else if(arrName[i].length > 3){
            cardName.push(arrName[i][0]);
        }
    }
    cardName.join(" ")
    //primeiro nome + iniciais de nomes do meio + ultimo nome
    return cardName[0];
}

export async function activate(cardId: number, cardCvv: string, password: string){
    const card = await cardRepository.findById(cardId);
    if(!card){
        throw {
            type: "Not Found", 
            message: "could not found company with API key"
        };
    }

    if(!bcrypt.compareSync(cardCvv, card.securityCode)){
        throw {
            type: "Unauthorized",
            message: "not authorized"
        };
    }

    const expired = compareDate(card.expirationDate);

    if(expired){
        throw {
            type: "Bad Request",
            message: "could not activate expired card"
        };
    }
    if(card.password){
        throw{
            type: "Conflict",
            message: "could not activate card again"
        }
    }
    if(password.length !== 4 || !parseInt(password)){
        throw {
            type: "Bad Request",
            message: "could not activate expired card"
        };
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    await cardRepository.updatePassword(card.id, passwordHash);
}

export async function getCardBalance(cardId: number){
    const card = await cardRepository.findById(cardId);
    if(!card){
        throw {
            type: "Not Found", 
            message: "could not found company with API key"
        };
    }

    return await cardRepository.cardBalance(cardId);
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