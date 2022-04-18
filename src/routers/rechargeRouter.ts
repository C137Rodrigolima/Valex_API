import { Router } from "express";
import * as rechargeController from "../controllers/rechargesController.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge", rechargeController.rechargeCard);

export default rechargeRouter;