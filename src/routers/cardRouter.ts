import { Router } from "express";
import * as cardController from "../controllers/cardController.js";

const cardRouter = Router();

cardRouter.get("/cardBalance/:id", cardController.checkBalance);
cardRouter.post("/createCard", cardController.createCard);
cardRouter.post("/activateCard", cardController.activateCard);

export default cardRouter;