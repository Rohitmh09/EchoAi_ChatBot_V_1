import express from 'express';
import axios from 'axios';
import conf from '../config/conf.js'; 
import db from '../database/database.js'
import { verifyUser } from '../middlewares/authMiddleware.js';
import logger from "../logFile/logger.js"


const router = express.Router();


const URL = `${conf.api_Url} ${conf.api_Key}`;

router.post('/evaluation',async (req, res) => {

    
    const userInput = req.body;
    // console.log(userInput);
    if (!userInput)
    {
      logger.error("User Input is required")
      return res.status(400).send({ error: 'User Input is required' });
    }
  
    const prompt = `Generate 10 interview as well as technical based questions for a candidate with the following details:
    Name: ${userInput.name}
    Experience: ${userInput.experience} years
    Technology Stack: ${userInput.techStack} remember this not provide any extra headings or text instead of questions`;
  
    try {
      const response = await axios.post(URL, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Extract each question as a separate string and return an array of questions
      const botResponse = response.data?.candidates?.[0]?.content?.parts
        ? response.data.candidates[0].content.parts[0].text.split('\n').filter(q => q.trim() !== "") // remove extra line 
        : ['No response available.'];
      
    //   console.log('API Response:', JSON.stringify(response.data));
     logger.info("Quetions are generated")
      return res.status(200).send({ questions: botResponse });
  
    } catch (error) {
      console.error('Error while generating questions:', error);
      logger.error('Error while generating questions:', error);
      return res.status(500).send({ error: 'An error occurred while generating the questions' });
    }
  });
  



  router.post('/submit', verifyUser,async (req, res) => {
    const { name, experience, techStack, questions, answers } = req.body;
    const userEmail = req.email;

    // console.log("user email=",userEmail);
    
    const userQuery = "SELECT user_id FROM user WHERE email = ?";
    const [rows] = await db.query(userQuery, userEmail);
    
      
    if (!Array.isArray(rows) || rows.length === 0) {
      logger.warn("User not found: " ,userEmail);
      return res.status(404).json({ Error: "User not found" });
    }
    
    const userId = rows[0].user_id;
    // console.log("userId=", userId);
    

    if (!questions || !answers || questions.length !== answers.length) {
      logger.info("Questions and answers are required and should match in length");
      return res.status(400).send({ error: 'Questions and answers are required and should match in length' });
    }
  
    try {
      let totalAccuracy = 0;
  
      // Iterate through each question-answer pair
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const userAnswer = answers[i];
  
        // Adjust the analysis complexity based on experience level
        let experienceLevel = '';
        if (experience >= 10) {
          experienceLevel = 'highly experienced';
        } else if (experience >= 5) {
          experienceLevel = 'moderately experienced';
        } else {
          experienceLevel = 'less experienced';
        }
  
        const prompt = `Analyze the following answer for a ${experienceLevel} person:
        Question: ${question}
        Answer: ${userAnswer}
        Consider the person's experience level when analyzing the depth and detail in their response. 
        For ${experienceLevel} individuals, evaluate whether the answer provides a comprehensive and well-reasoned analysis.
        Focus on understanding the intent of the answer, even if it's partially correct or contains minor mistakes (such as spelling or slight conceptual inaccuracies).
        Provide an accuracy rating between 0 and 100 based on how well the core concepts are explained, taking into account partial correctness as well.
        Only return the number.`;
  
        // Send request to AI API for each question-answer pair
        const response = await axios.post(URL, {
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }, {
          headers: { 'Content-Type': 'application/json' }
        });
  
        // Extract accuracy from the response (assuming response returns a number)
        const accuracy = parseFloat(response.data.candidates[0].content.parts[0].text.trim());
        // console.log("accuracy: " + accuracy);
  
        totalAccuracy += accuracy; // Add to total accuracy
      }
   
      // Calculate the average accuracy
      const averageAccuracy = totalAccuracy / questions.length;
    //  console.log("averageAccuracy: ",averageAccuracy);
     
      // Store in the database
      // console.log({ name, experience, techStack, averageAccuracy, userId });

      const insertQuery = `INSERT INTO evaluationData (name, experience, tech_stack, performance,user_id) VALUES (?, ?, ?, ?, ?)`;
      await db.execute(insertQuery, [name, experience, techStack, averageAccuracy, userId||null]);
     logger.info("Evaluation completed for user: " + userId);
      return res.status(200).send({ message: 'Evaluation completed', averageAccuracy });
    } catch (error) {
      logger.error('Error evaluating answers:', error);
      return res.status(500).send({ error: 'An error occurred while evaluating answers' });
    }
  });
  

export default router;

