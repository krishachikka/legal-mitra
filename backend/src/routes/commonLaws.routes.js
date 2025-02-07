import { Router } from "express";
import { getCommonLaws } from "../controllers/getCommonLaws.controllers.js";

const router = Router();

router.route('/').get(getCommonLaws);


export default router;