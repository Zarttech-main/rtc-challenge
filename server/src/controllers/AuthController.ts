import { Router } from "express";
import Joi from "joi";

import { signUp, signIn } from "../services/AuthService";

const authRouter = Router()

authRouter.post('/signup', async (req, res) => {

    const signupSchema = Joi.object({
        name: Joi.string().required().max(200),
        email: Joi.string().required().email().max(100),
        password: Joi.string().max(16).min(4)
    });

    const { error, value } = signupSchema.validate(req.body);
    if (error) {
        res.status(400).send(error.details);
    } else {
        try {
            const result = await signUp(value);
            res.send(result)
        } catch (error) {
            throw (error)
        }
    }

})


authRouter.post("/signin", async (req, res) => {
    const signinSchema = Joi.object({
        email: Joi.string().required().email().max(100),
        password: Joi.string().max(16).min(4)
    });

    const { error, value } = signinSchema.validate(req.body);

    if (error) {
        res.status(400).send(error.details);
    } else {
        try {
            const result = await signIn(value);
            res.send(result)
        } catch (error) {
            throw (error)
        }
    }
})

export default authRouter;
