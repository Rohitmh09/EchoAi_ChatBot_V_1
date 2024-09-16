import React from 'react'
import logo from '../Images/logo.png'
import { useNavigate } from 'react-router-dom'
import axios from "axios";


export default function Navbar() {

  const navigate = useNavigate();
  const handleLogOut= ()=>
  {
     axios.get('http://localhost:5000/user/logout').then((res)=>{
      console.log(res)
      navigate('/login');
     }).then((error) => console.log(error));
  }

  return (
    <div >
      <header >
        <nav
          className=" mx-auto h-16 flex max-w-8xl items-center justify-between p-6 lg:px-8 z-50"
          aria-label="Global"
        >
          <div className="flex flex-row items-center lg:flex-1">
            <div onClick={()=>navigate('/')}  className="-m-1.5 p-1.5 flex items-center cursor-pointer">
              <img className="h-12 w-auto" src={logo} alt=""/>
              <span className="text-2xl font-semibold text-gray-900 -ml-1">EchoAI</span>

            </div>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div onClick={handleLogOut}
              className="text-md font-semibold leading-6 text-gray-900 cursor-pointer"
            >
              Log out <span aria-hidden="true">&rarr;</span>
            </div>
          </div>
        </nav>
       
      </header>
    
    </div>
  )
}
