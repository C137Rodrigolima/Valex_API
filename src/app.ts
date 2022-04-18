import Express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routers/index.js";
import { handleErrorMiddleware } from "./middlewares/errorMiddleware.js";
dotenv.config();


const app = Express();
app.use(cors());
app.use(Express.json());

app.use(router);
app.use(handleErrorMiddleware);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Listening on PORT ${PORT}`)
})