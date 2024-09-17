import express from "express";
import conf from "../config/conf.js";
import db from "../database/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../logFile/logger.js"

const saltRounds=10;
const router = express.Router();
// Register route
router.post("/register", async  (req, res) => {
    const sql = "CALL RegisterUser(?, ?, ?)";
    
    try {
      const hash = await bcrypt.hash(req.body.password.toString(), saltRounds);
      const values = [req.body.name, req.body.email, hash];
      
      const [result] = await db.query(sql, values);
      logger.info(`User Registered: ${req.body.name}`);
      return res.json({ Status: "Success" });
    } catch (err) {
      logger.error(`Error registering user: ${err.message}`);
      return res.json({ Error: "Error inserting data", Details: err.message });
    }
  });
  
 const secret_key = conf.echoAI_Secret_Key;

  // Login route
  router.post("/login", async (req, res) => {
    const sql = "CALL LoginUser(?)";
    
    try {
      const [data] = await db.query(sql, [req.body.email]);
      // console.log(data[0]); // show=> [{}]
      if (data[0].length > 0) {
        const match = await bcrypt.compare(req.body.password.toString(), data[0][0].password); 
        
        if (match) {
          const { name, email } = data[0][0];
          const token = jwt.sign({ name, email }, secret_key, { expiresIn: "1d" }); // (payload,signature,time span)
          res.cookie("token", token);
          logger.info(`User logged in: ${email}`);
          return res.json({ Status: "Success",token });
        } 
        else {
          logger.warn(`Login attempt with incorrect password for email: ${req.body.email}`);
        }
       } 
      else {
       logger.warn(`Login attempt for non-existent email: ${req.body.email}`);
      }
  
      return res.json({ Error: "Invalid email or password" });
    } catch (err) {
      logger.error(`Error logging in: ${err.message}`);
      return res.json({ Error: "Server Error", Details: err.message }); 
    }
  });
     
  // Logout route
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    logger.info(`User logged out`);
    return res.json({ Status: "Success" });
  });

export default router;
