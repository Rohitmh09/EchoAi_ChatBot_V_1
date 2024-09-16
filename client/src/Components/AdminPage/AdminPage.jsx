import React, { useState } from "react";
import Loading from "../Loading/Loading";
import { Button, Box, Input, Textarea } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { triggerError } from "../Slice/accuracySlice";
import ConfettiEffect from "../ConfettiEffect/ConfettiEffect";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    projectFunctionality: "",
    technologyStack: "",
    complexityFactor: "",
  });
  const [employees, setEmployees] = useState([]);
  const dispatch = useDispatch();
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowOutput(false);

    try {
      const response = await fetch("http://localhost:5000/admin/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);

      setEmployees(data.employees);
      setShowOutput(true);
    } catch (error) {
      if (error.response && error.response.status === 503) {
        // Display alert if the status code is 503
        alert("Service is currently unavailable. Please try again later.");
      } else {
        dispatch(triggerError());
        console.error("Error submitting project details:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear =()=>
  {
    setFormData({
      projectName: "",
      projectFunctionality: "",
      technologyStack: "",
      complexityFactor: "",
    });
  }

  return (
    <>
      <ConfettiEffect />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        {loading && <Loading />}

        {!showOutput ? (
          <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg border border-gray-300">
            <form onSubmit={handleSubmit}>
              <Box className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-700 mb-6">
                  Project Details
                </h1>

                <Box className="mb-4">
                  <label
                    className="block text-gray-600 mb-2 font-medium"
                    htmlFor="projectName"
                  >
                    Project Name
                  </label>
                  <Input
                    id="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="Enter project name"
                    required
                    className="border border-gray-300 rounded-md p-4"
                  />
                </Box>

                <Box className="mb-4">
                  <label
                    className="block text-gray-600 mb-2 font-medium"
                    htmlFor="projectFunctionality"
                  >
                    Project Functionality
                  </label>
                  <Textarea
                    id="projectFunctionality"
                    value={formData.projectFunctionality}
                    onChange={handleChange}
                    placeholder="Enter project functionality"
                    required
                    className="border border-gray-300 rounded-md p-4 scroll-slim"
                  />
                </Box>

                <Box className="mb-4">
                  <label
                    className="block text-gray-600 mb-2 font-medium"
                    htmlFor="technologyStack"
                  >
                    Technology Stack
                  </label>
                  <Input
                    id="technologyStack"
                    value={formData.technologyStack}
                    onChange={handleChange}
                    placeholder="Enter technology stack"
                    required
                    className="border border-gray-300 rounded-md p-4"
                  />
                </Box>
                <Box className="mb-4">
                  <label
                    className="block text-gray-600 mb-2 font-medium"
                    htmlFor="technologyStack"
                  >
                    Complexity Level
                  </label>
                  <Input
                    id="complexityFactor"
                    type="number"
                    value={formData.complexityFactor}
                    onChange={handleChange}
                    placeholder="Enter Project Complexity(1 being low, 5 being high)."
                    required
                    className="border border-gray-300 rounded-md p-4"
                  />
                </Box>

                <div className="flex justify-between">
                  <Button
                    colorScheme="blue"
                    className="text-white"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="green"
                    className="text-white"
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              Employee List
            </h2>
            <ul className="space-y-4">
              {employees.length > 0 ? (
                employees.map((employee, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <span className="text-gray-900 font-medium">
                      {employee.name}
                    </span>
                    <span className="text-gray-600">
                      {employee.experience} yrs exp
                    </span>
                    <span className="text-gray-600">
                      {employee.performance} score
                    </span>
                    <span className="text-gray-600">
                      {employee.tech_stack} tech
                    </span>
                    <span className="text-gray-600">
                      {employee.project_completion_time} time
                    </span>{" "}
                    {/* Display the time span from AI API */}
                  </li>
                ))
              ) : (
                <li className="text-gray-600">No suitable employees found.</li>
              )}
            </ul>
            <div className="flex justify-end">
              <Button
                onClick={() => setShowOutput(false)}
                colorScheme="green"
                className="text-white mt-2"
              >
                Back
              </Button>

            </div>
          </div>
        )}
      </div>
    </>
  );
}
