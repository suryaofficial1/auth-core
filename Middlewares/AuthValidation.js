import Joi from "joi";
import { getErrorObject } from "../utils/responseUtil.js";

const middlewere = {};
middlewere.signupValidation = (req, res, next) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(50).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.send(getErrorObject(400, 'Bad request', error.details[0].message));
    }
    next();
};

middlewere.loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(50).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.send(getErrorObject(400, 'Bad request', error.details[0].message));
    }
    next();
};
middlewere.otpValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.send(getErrorObject(400, 'Bad request', error.details[0].message));
    }
    next();
};


export default middlewere;