
import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import cors from "cors";


import connectDB from "./configs/mongodb.js";
import connectCloudinary from "./configs/cloudinary.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";



//Initialize Express
const app = express();




// Connect to DB and Cloudinary
await connectDB();
connectCloudinary();

// Middlewares
app.use(cors({
  origin: "https://lms-project-ruby-sigma.vercel.app",
  credentials: true
}));
app.use(clerkMiddleware());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API Working"));
app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(),  educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
