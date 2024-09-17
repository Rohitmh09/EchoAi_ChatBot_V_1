import express from "express";
import axios from "axios";
import conf from "../config/conf.js";
import db from "../database/database.js";
import logger from "../logFile/logger.js";

const router = express.Router();
const URL = `${conf.api_Url}${conf.api_Key}`;

// Utility function to format the completion time received from AI API
const formatTimeSpan = (timeSpan) => {
  // Implement any additional formatting if necessary
  return timeSpan;
};

// Helper function to fetch employee data based on technology stack
const fetchEmployees = async (technologyStack, userId) => {
  // console.log(userId);

  const formattedTechStack = technologyStack
    .toLowerCase()
    .split(/[\s,]+/) // Split by spaces or commas
    .map((tech) => `(^|[[:space:]])${tech}([[:space:]]|$)`); // Ensure word boundaries

  const conditions = formattedTechStack
    .map(() => "e.tech_stack REGEXP ?")
    .join(" OR ");

  const fetchQuery = `
    SELECT e.name, e.experience, e.tech_stack, e.performance, e.user_id
    FROM evaluationData e
    JOIN User u ON e.user_id = u.user_id
    WHERE (${conditions}) AND e.user_id = ?
    ORDER BY e.performance DESC, e.experience DESC
  `;

  const [rows] = await db.execute(fetchQuery, [...formattedTechStack, userId]);
  // console.log("rows: " + rows);

  return rows;
};

// /analyze API
router.post("/analyze", async (req, res) => {
  const adminInput = req.body;
  // console.log("input from admin",adminInput);
  const userEmail = req.email;
  // console.log("user email=",userEmail);

  const userQuery = "SELECT user_id FROM user WHERE email = ?";
  const [rows] = await db.query(userQuery, userEmail);

  if (!Array.isArray(rows) || rows.length === 0) {
    // logger.warn("User not found: " ,userEmail);
    return res.status(404).json({ Error: "User not found" });
  }

  const userId = rows[0].user_id;

  // Validate the input
  if (
    !adminInput ||
    !adminInput.technologyStack ||
    !adminInput.projectFunctionality
  ) {
    return res.status(400).send({
      error: "Technology stack and project functionality are required",
    });
  }

  try {
    // Fetch employee data using the helper function (same as demo)
    const employees = await fetchEmployees(adminInput.technologyStack, userId);

    if (employees.length === 0) {
      return res.status(200).send({ employees: [] });
    }

    // Send each employee's details to the AI API
    const promises = employees.map(async (employee) => {
      const prompt = `Given the following employee profile and the project details, estimate the time needed for this employee to complete the project. The project requires the following functionality: "${adminInput.projectFunctionality}" and uses the following technology stack: "${adminInput.technologyStack}". Consider the following employee details:
- Name: ${employee.name}
- Experience: ${employee.experience} years
- Technology Stack: ${employee.tech_stack} known by ${employee.name}
- Test Performance: ${employee.performance}. 
-  Consider a potential project complexity factor of ${adminInput.complexityFactor} (1 being low, 5 being high).
remember return low experience person more time and high experience less time.
Only provide the estimated completion time in days, weeks, or months. Do not return any other text.`;
      try {
        const aiResponse = await axios.post(
          URL,
          {
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const aiContent =
          aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
          "Unknown";
        // console.log("AI Content:", aiContent);

        // Format the time span if necessary
        const timeSpan = formatTimeSpan(aiContent);
        logger.info(`AI API response for employee ${employee.name}:`);
        return {
          ...employee,
          project_completion_time: timeSpan,
        };
      } catch (error) {
        logger.error(
          `Error calling AI API for employee ${employee.name}:`,
          error
        );

        return {
          ...employee,
          project_completion_time: "Unknown",
        };
      }
    });

    const analyzedEmployees = await Promise.all(promises);

    // Sort the employees based on the estimated completion time
    const sortedEmployees = analyzedEmployees.sort((a, b) => {
      const parseTime = (time) => {
        const match = time.match(/(\d+)/);
        return match ? parseInt(match[0], 10) : Infinity;
      };

      const timeA = parseTime(a.project_completion_time);
      const timeB = parseTime(b.project_completion_time);
      // console.log("A=",timeA,"B=",timeB);
      
      return timeA - timeB;
    });

    logger.info("Sorted employees successfully");
    res.status(200).send({ employees: sortedEmployees });
    // res.status(200).send({ employees: analyzedEmployees });
  } catch (error) {
    logger.error("Error in analyze route:", error);
    return res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
