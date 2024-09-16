import { configureStore } from "@reduxjs/toolkit";
import ChatReducer from "../Slice/ChatBotSlice";
import accuracyReducer from "../Slice/accuracySlice";

const store = configureStore(
    {
        reducer: {
            chat: ChatReducer,
            accuracy: accuracyReducer,
        },
    }
);
export default store;