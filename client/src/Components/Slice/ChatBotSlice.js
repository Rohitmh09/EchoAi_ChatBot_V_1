import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [
    {
      sender: "bot",
      text: `# **👋 Hello, I'm _EchoAI_, developed by _Rohit Mahadik_!**

Here's what I can do to assist you:

### **Daily Task Assistance**
     - Answer your questions, generate code and much more.

### **Evaluation Test Support**
     - Allow employees to test their knowledge in specific technical areas.
     - Offer questions based on their experience and skills.
     - Show the final score after the test is completed.

### **Admin Panel**
     - Project leaders can enter project details and required tech skills.
     - Automatically find employees with matching skills for the project.
     - Show project timelines and relevant employee information.
   
 **🌟how I can assist you today!🚀**`
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
