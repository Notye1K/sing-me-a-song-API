import { Router } from "express";
import * as testController from "../controllers/testController.js";

const testRouter = Router();

testRouter.delete("/delete", testController.deleteAll);

export default testRouter;
