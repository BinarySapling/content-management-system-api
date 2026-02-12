import express from "express";
import {
  initiateSignup,
  verifySignupOtp,
  login
} from "../controllers/auth.controller.js";

const router = express.Router();


router.post("/signup/initiate", initiateSignup);

router.post("/signup/verify", verifySignupOtp);
router.post("/login", login);

export default router;
