import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Nevbar/Navbar";
import SidebarDrawer from "../Drawer/SidebarDrawer";

import axios from "axios";

export default function Layout() {
  const [auth, setAuth] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        if (response.data.Status === "Success") {
          setAuth(true);
          console.log(response.data.name, response.data.email);
        } 
        else {
          setAuth(false);
          console.log(response.data.Status);
          navigate("/login");
        }
      })
      .catch((error) => 
        {
         if (error.response.status === 401) {
           // If the response is 401 Unauthorized, clear the token and redirect
           localStorage.removeItem('token');
           navigate('/login');  // Redirect to login page
         } 
         else {
           console.error('An error occurred:', error);
        }
       }
       );
  }, [navigate]);


  return auth ?(
      <>
      <Navbar />
      <SidebarDrawer/>
      <Outlet />
    
    </>
  ): null;
}
