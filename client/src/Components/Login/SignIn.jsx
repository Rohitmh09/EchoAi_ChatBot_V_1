import React, { useState } from 'react';
import logo from "../Images/logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const SignIn = () => {

  const [errorMessage, setErrorMessage] = useState();
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  
  const clearMessage = () => setErrorMessage('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/user/login', values)
      .then((response) => {
        if (response.data.Status === 'Success') {
          localStorage.setItem('token', response.data.token); // Store the token in localStorage
          navigate('/');
        } else {
          console.log(response.data.Error);
          setErrorMessage(response.data.Error);
          
          
        }
      })
      .catch((error) => {
        console.log(error.response);
        console.log(error.message);
      });
  };

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20 w-auto"
          src={logo}
          alt="Your Company"
        />
        <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6" action="#" method="POST">
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
                    setValues({ ...values, email: e.target.value })
                  }
                  
                  onFocus={()=>  clearMessage()}
                  autoComplete="email"
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
                    setValues({ ...values, password: e.target.value })
                  }
                  onFocus={()=>  clearMessage()}
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

                  <div className=' flex justify-center text-sm font-medium text-red-600'>
                      {errorMessage}
                  </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Login
              </button>
            </div>
            <div>
              <Link to="/register">
              <button
                
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                Create Account
              </button>
                </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
