import express from 'express';
import cors from 'cors';
import axios from 'axios';
import conf from './config/conf.js';  // Ensure this file has your Google AI Studio API key
import evaluation from "./routes/evaluation.js"
import admin from "./routes/admin.js"
import chatBot from "./routes/chatBot.js"
import cookieParser from "cookie-parser";
import user from "./routes/user.js"
import { verifyUser } from './middlewares/authMiddleware.js';
import logger from './logFile/logger.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);



app.use('/admin',verifyUser,admin)
app.use('/evaluate',evaluation)
app.use('/chat',chatBot)
app.use('/user',user)

 
  // Protected route 
app.get("/", verifyUser, (req, res) => {
    logger.info(`User accessed protected route: ${req.email}`);
    // console.log("called protected route");
    return res.json({ Status: "Success", name: req.name, email: req.email });
  });

app.listen(conf.port || 5000, () => {
  logger.info("Server is running");
  console.log(`Server is running on port ${conf.port}`);
});
