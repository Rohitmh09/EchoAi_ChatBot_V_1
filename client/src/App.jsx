import "./App.css";
import Chat from "./Components/ChatBot/chat";
import { Provider } from "react-redux";
import store from "./Components/Store/store";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import EvalutionTest from "./Components/Evaluation_Page/EvalutionTest";
import AdminPage from "./Components/AdminPage/AdminPage";
import Register from "./Components/Login/Register";
import SignIn from "./Components/Login/SignIn";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<SignIn />} />
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Chat />} />
          <Route path="EvalutionTest" element={<EvalutionTest />} />
          <Route path="Admin" element={<AdminPage />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;
