import { Router } from "express";
import { getCommonLaws } from "../../controllers/api_calls/getCommonLaws.controllers.js";

const router = Router();

router.route('/').get(getCommonLaws);


export default router;