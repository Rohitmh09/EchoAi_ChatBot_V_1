import React, { useState } from "react";
import logo from "../Images/logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [values, setvalues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
     
    if (values.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    axios.post("http://localhost:5000/user/register", values, {headers:{'Content-Type':'application/json'}}) // what ever return from server it will get here like status: Success etc
      .then((response) => {
        console.log(response.data);
        
        if (response.data.Status === "Success") {
          navigate("/login");
        } else {
          alert("ID Already Exist or Login Error");

        }
      })
      .then((error) => console.log(error));
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-20 w-auto" src={logo} alt="logo" />
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Sign up to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  onChange={(e) =>
                    setvalues({ ...values, name: e.target.value })
                  }
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={(e) =>
                    setvalues({ ...values, email: e.target.value })
                  }
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={(e) =>
                    setvalues({ ...values, password: e.target.value })
                  }
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="flex mt-6 justify-center text-sm text-gray-500">
            Already a member?{" "}
            <div
             onClick={() => navigate("/login")}
              className="font-medium cursor-pointer text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </div>
          </p>
        </div>
      </div>
    </div>
  );
}
