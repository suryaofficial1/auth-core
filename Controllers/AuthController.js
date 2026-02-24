import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authModel from "../Models/AuthModel.js";
import validationService from "../service/validation.service.js";
import { getErrorObject, getSuccessObject } from "../utils/responseUtil.js";
import { sendEmail } from "../utils/SendEmail.js";


const authController = {};

authController.signup = async (req, res, next) => {
    try {
        const { body } = req;
        const error = validationService.validateRequired(body, ['firstName', 'lastName', 'email', 'password']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const isExitUser = await authModel.getUserByEmail(body.email);
        if (isExitUser.length) {
            return res.send(getErrorObject(409, 'User already exists'));
        }
        const reqBody = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            password: await bcrypt.hash(body.password, 10)
        };
        await authModel.createUser(reqBody);
        return res.send(getSuccessObject());

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}
authController.login = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email', 'password']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const user = await authModel.getUserByEmail(req.body.email);
        if (!user.length) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const isMatch = await bcrypt.compare(req.body.password, user[0].password);
        if (!isMatch) {
            return res.send(getErrorObject(401, 'Invalid credentials'));
        }
        const token = jwt.sign({ id: user[0].id, email: user[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.send(getSuccessObject({ isLoggedIn: true, token, id: user[0].id,  email: user[0].email, firstName: user[0].f_name, lastName: user[0].l_name }));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}
authController.sendOtp = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const user = await authModel.getUserByEmail(req.body.email);
        if (!user.length) {
            return res.send(getErrorObject(404, 'User not found'));
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const send = await sendEmail(req.body.email, otp);
        if(send == true){
            const reqObj = {
                id: user[0].id,
                email: user[0].email,
                otp: otp,
                status: 0,
                contact: user[0].email,
                userAgent: req.headers['user-agent'],
                ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
            }
            await authModel.sendOtp(reqObj);
            return res.send(getSuccessObject("OTP sent successfully"));
        }

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
}
authController.verifyOtp = async (req, res) => {
    try {
        const error = validationService.validateRequired(req.body, ['email', 'otp']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const verifyCode = await authModel.getOtpEmail(req.body.email);
        if (!verifyCode) {
            return res.send(getErrorObject(404, 'Otp not found!'));
        }
        if(verifyCode.otp === req.body.otp){
            await authModel.verifyCode({id: verifyCode.id, userId: verifyCode.userId, status: 1});
            return res.send(getSuccessObject('Otp verified successfully'));
        }
        return res.send(getErrorObject(401, 'Invalid Otp'));
    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
};

authController.updatePassword = async (req, res) =>{
    try {
        const error = validationService.validateRequired(req.body, ['email', 'password']);
        if (error) {
            return res.send(getErrorObject(400, 'Bad request', error));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        await authModel.updatePassword({email: req.body.email, password: hashedPassword});
        return res.send(getSuccessObject('Password updated successfully'));

    } catch (err) {
        console.log(err)
        res.send(getErrorObject(500, "Internal Server Error", err));
    }
} 

export default authController;