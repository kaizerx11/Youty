import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})







connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`the server is running on the port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("mongodb connection failed",err);
})