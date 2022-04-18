import { Router } from "express";
import * as paymentsController from "../controllers/paymentsController.js";

const paymentRouter = Router();

paymentRouter.post("/payment", paymentsController.paymentInPos);

export default paymentRouter;