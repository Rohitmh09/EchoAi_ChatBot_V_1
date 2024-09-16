import React, { useState } from "react";
import { Button, Box, Input, Textarea } from "@chakra-ui/react";
import Loading from "../Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import ConfettiEffect from "../ConfettiEffect/ConfettiEffect";
import { setAccuracyScore, triggerError } from "../Slice/accuracySlice";

const EvalutionTest = () => {
  const dispatch = useDispatch();
  const { showError } = useSelector((state) => state.accuracy);

  // State for user inputs
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [techStack, setTechStack] = useState("");

  //state of loading effect
  const [loadEffect, setloadEffect] = useState(false);

  // State for question and answer
  const [question, setQuestion] = useState(
    "Your first question will appear here."
  );
  const [answer, setAnswer] = useState("");

  // State to manage disabled fields
  const [isTestGenerated, setIsTestGenerated] = useState(false);

  //Update the state to store questions
  const [questions, setQuestions] = useState([]);
  const [answerList, setAnswerList] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testOver, setTestOver] = useState(false);

  const handleGenerateTest = async () => {
    setloadEffect(true);

    const userInput = {
      name,
      experience,
      techStack,
    };

    try {
      const response = await fetch(
        `http://localhost:5000/evaluate/evaluation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInput),
        }
      );
      const data = await response.json();
      // Set the questions array and display the first question
      setQuestions(data.questions);
      setQuestion(data.questions[0]);
      setCurrentQuestionIndex(0);
      console.log("First question:", data.questions[0]);

      setIsTestGenerated(true);
      setloadEffect(false);
    } catch (error) {
      console.error("Error generating test:", error);
      setQuestion("Error generating test. Please try again.");
      setloadEffect(false);
    }
  };

  const handleRegenerateTest = () => {
    // Enable input fields again for the user to re-enter information
    setIsTestGenerated(false);
    setName("");
    setExperience("");
    setTechStack("");
    setAnswer("");
    setAnswerList([]);
    setTestOver(false);
    setQuestion("Your first question will appear here.");
  };

  const handleNextQuestion = () => {
    // If no answer was given, store 'Nan' as the answer
    const currentAnswer = answer.trim() === "" ? "Nan" : answer;

    // Create the updated answer list locally
    const updatedAnswerList = [...answerList, currentAnswer];

    // Add the answer to the answerList
    setAnswerList(updatedAnswerList);

    // If there are more questions, move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestion(questions[currentQuestionIndex + 1]);
      setAnswer(""); // Clear the answer input for the next question
    } else {
      // If no more questions, update the question and handle the end of the test
      console.log("Answer List:", updatedAnswerList); // Log the correct answer list
      setTestOver(true);
      setAnswer("");
      setQuestion("No more questions available please submit the test.");
    }
  };

  // Function to submit answers to the backend
  const submitAnswersToBackend = async () => {
    const payload = {
      name,
      experience,
      techStack,
      answers: answerList, // Send the list of answers
      questions, // Send the list of questions for comparison
    };
    setloadEffect(true);
    try {
      const response = await fetch("http://localhost:5000/evaluate/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Correct way to send cookies with the request
      });

      const data = await response.json();
      setloadEffect(false);

      console.log("Backend response:", data);
      handleRegenerateTest();
      setAnswerList([]);

      if (data.averageAccuracy) {
        dispatch(setAccuracyScore(data.averageAccuracy)); // Store accuracy in Redux
      }
    } catch (error) {
      console.error("Error submitting answers to the backend:", error);
      setloadEffect(false);
      dispatch(triggerError());
      handleRegenerateTest();
    }
  };

  return (
    <>
      {loadEffect && <Loading />}
      {/* Confetti Effect Component */}
      <ConfettiEffect/>

      {/* Display warning message if submission fails */}
      {showError}
      <div className="flex justify-center  items-center min-h-screen bg-gray-100">
        <Box className="w-full max-w-xl  bg-white border-2-black shadow-lg rounded-lg p-5">
          <h1 className="text-2xl font-semibold text-gray-700 mb-8">
            EchoAI Evaluation Test
          </h1>

          {/* User Input Fields */}
          <Box className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Enter your name:
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-4"
              isDisabled={isTestGenerated} // Disable when test is generated
            />
          </Box>

          <Box className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Years of experience:
            </label>
            <Input
              type="number"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Enter years of experience in number"
              className="w-full border border-gray-300 rounded-md p-4"
              isDisabled={isTestGenerated} // Disable when test is generated
            />
          </Box>

          <Box className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Technology stack:
            </label>
            <Input
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="Enter technology stack"
              className="w-full border border-gray-300 rounded-md p-4"
              isDisabled={isTestGenerated} // Disable when test is generated
            />
          </Box>

          {/* Question Field */}
          <Box className="mb-4">
            <label className="block text-gray-600 mb-2 font-medium">
              Question
            </label>
            <Textarea
              value={question}
              isReadOnly
              className="w-full border border-gray-300 rounded-md p-4 bg-gray-50 scroll-slim" // Change background color for visibility
              minHeight="100px"
              resize="none" // Prevent resizing for better UX
              _readOnly={{
                opacity: 1, // Ensure question text is fully visible
                color: "black", // Make text color solid black for better readability
              }}
            />
          </Box>

          {/* Answer Input Field */}
          <Box className="mb-6">
            <label className="block text-gray-600 mb-2 font-medium">
              Your Answer
            </label>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here"
              className="w-full border border-gray-300 rounded-md p-4 scroll-slim"
              minHeight="100px"
              isDisabled={!isTestGenerated} // Enable only when test is generated
            />
          </Box>

          {/* Buttons */}
          <div className="flex justify-between">
            {!isTestGenerated ? (
              <Button
                colorScheme="blue"
                onClick={handleGenerateTest}
                className="mr-4"
              >
                Generate Test
              </Button>
            ) : (
              <Button
                colorScheme="red"
                onClick={handleRegenerateTest}
                className="mr-4"
              >
                Regenerate Test
              </Button>
            )}

            {testOver ? (
              <Button
                colorScheme="green"
                onClick={submitAnswersToBackend}
                isDisabled={!isTestGenerated} // Disable when test is not generated
              >
                Submit
              </Button>
            ) : (
              <Button
                colorScheme="green"
                onClick={handleNextQuestion}
                isDisabled={!isTestGenerated} // Disable when test is not generated
              >
                Next
              </Button>
            )}
          </div>
        </Box>
      </div>
    </>
  );
};

export default EvalutionTest;
