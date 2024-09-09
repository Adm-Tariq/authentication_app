import { Router } from "express";
import getAllUsers from "../controllers/usersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const router = Router();

router.use(verifyJWT);
router.route("/").get(getAllUsers);

export default router;
