import express, {Application} from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"
import connectToDB from "./config/database";
import helmet from "helmet";

dotenv.config();
const app:Application = express()

app.use(helmet())
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS,
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// app.use("/api/auth", authRoutes)
// app.use(errorHandler)

const startServer = async ()=>{
    try{
        await connectToDB()
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        app.listen(process.env.PORT, ()=>{
            console.log(`Server is listening on ${process.env.PORT}`)
        })
    }
    catch(error){
        console.log(`ERROR: ${error}`)
        process.exit(1)
    }
}

startServer()
