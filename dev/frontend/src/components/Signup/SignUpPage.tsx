"use client";
import * as React from "react";
import { useState } from "react";
import axios from "axios"; // Import Axios
import { Logo } from "./Logo";
import { SphereBackground } from "./SphereBackground";
import { FormInput } from "./FormInput";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';


export default function SignUpPage() {
  const Backend_Url = import.meta.env.Backend_Url
  // State to manage form inputs
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State to manage button text
  const [buttonText, setButtonText] = useState("Get Started");

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default form submission
    setButtonText("Signing Up...");

    try {
      // Send form data using Axios
      const response = await axios.post(`${Backend_Url}/api/register`, formData, {withCredentials : true});
      console.log("Response:", response.data);

      // Handle success (e.g., redirect or show a success message)
      toast.success("Successfully signed up! 🎉");
      setButtonText("Signed Up!");
      navigate("/signin", { replace: true }); // Redirect to the "/welcome" page
    } catch (error) {
      console.error("Error signing up:", error);
      if(!formData.name){
        toast.error("All fields are mandatory")
      }else{
        toast.error("Error signing up");
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      // Handle error (e.g., show an error message)
      setButtonText("Get Started");
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Raleway:wght@400&display=swap"
        rel="stylesheet"
      />
      <main className="relative p-5 mx-auto w-full max-w-none min-h-screen bg-zinc-900 max-md:max-w-[991px] max-sm:max-w-screen-sm bg-[url(https://c.animaapp.com/fOFXwWPz/img/image-10.png)] overflow-hidden">
        <Logo />
        <SphereBackground />

        <section className="mx-auto mt-52 mb-0 text-center max-w-[517px]  max-sm:px-5 max-sm:py-0 ">
          <h2 className="mb-2.5 text-xl text-white">Let's get you started</h2>
          <h1 className="mb-10 text-5xl font-bold text-white max-sm:text-4xl">
            Create an Account
          </h1>
          <form className="flex flex-col gap-5 items-center max-sm:w-full">
            <FormInput
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange} // Handle input changes
              className="h-[45px] max-w-[380px] w-full px-4 py-2 text-xl rounded-[9px] border-[3px] border-gray-700 border-width-2 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <FormInput
              type="email"
              name="email"
              placeholder="Email id"
              value={formData.email}
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
            <FormInput
              type="password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange} // Handle input changes
              className="h-[45px] max-w-[380px] w-full px-4 py-2 text-xl rounded-[9px] border-[3px] border-gray-700 border-width-2 bg-zinc-900 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="submit"
              onClick={handleSignUp}
              className="mt-5 text-2xl font-bold rounded-xl border-b-4 border-solid bg-green-300 cursor-pointer border-[none] border-b-green-600 h-[55px] text-black w-[431px] max-sm:w-full max-sm:max-w-[411px] hover:bg-green-600 transition-colors"
            >
              {buttonText}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}