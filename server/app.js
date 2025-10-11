import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
// import { clerkMiddleware, requireAuth } from "@clerk/express";
import connectCloudinary from "./config/cloudinary.js";
import routes from "./routes/index.js";


const app = express();



async function connectionToCloudinary(){
    try {
      await connectCloudinary();
      console.log("Connection to cloudinary successful");
    } catch (error) {
        console.log("Error in connection to cloudinary: ",error);
        process.exit(1);
    }
}

connectionToCloudinary();


app.use(cors({
  origin: ['http://localhost:5173',"https://texting-app-ontb.onrender.com"],
  credentials: true                
}));
app.use(express.json());
app.use(cookieParser());
// app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.send("server is live");
});

// app.use(requireAuth());

app.use(routes);

export default app;


