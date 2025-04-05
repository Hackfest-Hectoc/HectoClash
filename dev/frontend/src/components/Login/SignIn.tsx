"use client";
import * as React from "react";
import { useState } from "react";
import axios from "axios"; // Import Axios
import { Logo } from "./Logo";
import { SphereBackground } from "./SphereBackground";
import { FormInput } from "./FormInput";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';

export default function SignIn() {
  const navigate = useNavigate()
  // State to manage form inputs
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State to manage button text
  const [buttonText, setButtonText] = useState("Sign In");

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission
    setButtonText("Signing In...");

    try {
      // Send form data using Axios
      const response = await axios.post(`http://localhost:8000/api/login`, formData, {withCredentials: true});
      console.log("Response:", response.data);

      // Handle success (e.g., redirect or show a success message)
      setButtonText("Signed In!");
      toast.success("Successfully signed in! 🎉");
      navigate("/home", { replace: true }); // Redirect to the "/welcome" page
    } catch (error) {
      console.error("Error signing in:", error);
     if(!formData.username || !formData.password){
      toast.error("All fields are mandatory")
     }else{

       toast.error("Invalid credentials or server error.")
     }
      // Handle error (e.g., show an error message)
      setFormData({
        username: "",
        password: "",
      })
      setButtonText("Sign In");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Raleway:wght@400&display=swap"
        rel="stylesheet"
      />
      <main className="relative p-5 mx-auto w-full max-w-none min-h-screen bg-zinc-900 overflow-hidden max-sm:max-w-screen-sm bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)]">
        <Logo />
        <SphereBackground />

        <section className="mx-auto mt-56 mb-0 text-center max-w-[517px]  max-sm:px-5 max-sm:py-0 ">
          <h1 className="mb-10 text-5xl font-bold text-white max-sm:text-4xl">
            Sign In.
          </h1>
          <form className="mt-12 flex flex-col gap-5 items-center max-sm:w-full">
            <FormInput
              type="text"
              name="username"
              placeholder="Name"
              value={formData.username}
              onChange={handleChange} // Handle input changes
              className="h-[45px] max-w-[380px] w-full px-4 py-2 text-xl rounded-[9px] border-[3px] border-gray-700 border-width-2 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <FormInput
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange} // Handle input changes
              className="h-[45px] max-w-[380px] w-full px-4 py-2 text-xl rounded-[9px] border-[3px] border-gray-700 border-width-2 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              onClick={handleSignIn} // Add the onClick handler here
              className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[431px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
            >
              {buttonText} {/* Dynamically display the button text */}
            </button>
          </form>
          <div className="mt-4">
            <h3 className="inline-block mb-2 text-l text-white max-sm:text-m">
              Don't have an account?
            </h3>
            <Link
              to="/signup"
              className="ml-[6px] inline-block text-xl font-bold text-white hover:underline max-sm:text-m"
            >
              Create an account
            </Link>
            <Link
              to="/signup"
              className="ml-[6px] block text-xl font-bold text-white hover:underline max-sm:text-m"
            >
              Forgot Password?
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}