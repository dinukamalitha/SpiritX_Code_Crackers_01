import {loginUser, registerUser} from "../services/auth.service";
import {userSchema} from "../schema/registerSchema";
import {Request, Response, NextFunction} from "express";
import {CREATED, OK} from "../constants/http";
import {setAuthCookies} from "../utils/cookies";

export const authController = {
    signUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = userSchema.parse(req.body);
            const newUser = await registerUser(userData);
            res.status(CREATED).json(newUser);
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {email, password} = req.body;
            const {userId, accessToken, refreshToken} = await loginUser(email, password);

            setAuthCookies({res, accessToken, refreshToken})
            res.status(OK).json({userId});
        }catch(error){
            next(error);
        }
    },


    logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            res.clearCookie("accessToken", { path: "/" });
            res.clearCookie("refreshToken", { path: "/auth/refresh" });

            res.status(OK).json({ message: "Logged out successfully" });
        }catch (error){
            next(error)
        }
    }
}