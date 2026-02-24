
import express from 'express';
import middlewere from '../Middlewares/AuthValidation.js';
import authController from '../Controllers/AuthController.js';
const router = express.Router();


router.post('/login' , middlewere.loginValidation, authController.login);

router.post('/signup', middlewere.signupValidation, authController.signup)
router.post('/send-otp', middlewere.otpValidation, authController.sendOtp)
router.post('/verify-otp', authController.verifyOtp);
router.post('/update-password', authController.updatePassword);

export default router

