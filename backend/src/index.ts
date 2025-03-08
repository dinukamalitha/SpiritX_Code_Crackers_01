import express, {Application, Request, Response, NextFunction} from "express";
import dotenv from "dotenv";
import cors from "cors";
import {PORT, APP_ORIGIN} from "./constants/env";
import AppDataSource from "./config/connectDB";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import {OK} from "./constants/http";
import authRoutes from "./routes/auth.routes";

dotenv.config();

const app:Application = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
);
app.use(cookieParser());

//Routes
app.use("/auth", authRoutes);
app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.status(OK).json({
            status: "success",
        });
    }
);

app.use(errorHandler);

/*
app.get("/users", async(req, res) => {
    try{
        const client = await pool.connect();
        console.log("Database Connection Successful");
        const result = await client.query("SELECT * FROM user");
        client.release();
        res.json(result.rows);
    }catch(err){
        console.error("Error executing query",err);
        res.status(500).json({
            status: "Internal Server Error"
        });
    }
});
* */

//Initialize Database
const DBConnection = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connection successful");
    } catch (err) {
        console.error("Database connection failed", err);
        process.exit(1);
    }
};
DBConnection();


//Start the Server
const port: number = parseInt(PORT,10);
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
