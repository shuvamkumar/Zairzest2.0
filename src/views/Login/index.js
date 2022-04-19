import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useCookies } from "react-cookie";
import axios from "axios";
import { config } from "../../config";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/signup.css"
import logo from "../../assets/logo.png"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const gooogleProvider = new GoogleAuthProvider();
  const [cookies, setCookie, removeCookie] = useCookies(["user-token"]);

  const loginUserButtonHandler = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log("Login Successfull!");
        console.log(response);
        auth.currentUser.getIdToken().then((res) => signIn(res));
      })
      .catch((error) => {
       toast.error(error.message)
      });
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, gooogleProvider)
      .then((response) => {
        console.log("Register Successfull!");
        auth.currentUser.getIdToken().then((res) => signIn(res));
      })
      .catch((error) => {
        toast.error(error.message)
      });
  };

  function signIn(userToken) {
    axios
      .get(`${config.BASE_URL}/auth/signin`, {
        headers: {
          Authorization: userToken,
        },
      })
      .then((res) => {
        if (res.data.status === 200 || res.data.status === 201) {
          toast.success(res.data.message);
          setCookie("userToken", res.data.token);
          if(res.data.data.isVerified){
            navigate("/user",{ state : res.data.data})
          }else{
            navigate("/register", { state: res.data.data });
          }
        } else {
          toast.error("Some error occured");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }

  return (
    <div className="h-screen w-screen md:flex items-center login-container">
       <ToastContainer />
      <Link to="/"><img src={logo} alt="" style={{ position: "fixed", top: "3rem", width: "17rem", height: "2rem", left: "7rem" }} /></Link>
      <div className="hidden md:flex md:flex-col md:flex-1 left-section pl-8 md:pl-28 md:pr-0 ">
        <h1 className="font-bold text-white text-3xl md:text-6xl mb-12">
          Experience the
          <br />
          Future Tech with
          <br />
          zairza
        </h1>
        <p className="text-md font-medium text-white mt-6">
          Release all your stress with the exciting
          <br /> Tech and Fun events in the most
          <br /> awaited fest . Zairzest 2.0 presented by
          <br /> Zairza.
        </p>
      </div>
      <div className="px-4 md:px-0 md:w-1/3 h-full grid place-items-center bg-white">
        <div>
          <h2 className="text-regalbluefont text-4xl font-medium mb-2">
            Experience the Future Tech
          </h2>
          <p className="text-grayishfaint text-md mb-8">
            Sign In to get into Zairzest
          </p>
          <div className="rounded-lg border-2 border-stone-400 w-full p-1 mb-2">
            <input
              className="border-none focus:outline-none w-full h-full py-2 px-1 text-grayishfaint"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email here"
            />
          </div>
          <div className="rounded-lg border-2 border-stone-400 w-full p-1 flex items-center">
            <input
              className="border-none focus:outline-none text-grayishfaint w-full h-full py-2 px-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div>
            <p className="text-md text-grayishfaint mt-4">
              Don't remember Password ?{" "}
              <span className="text-deepPinkish font-md cursor-pointer">
                Reset Password
              </span>
            </p>
            <p className="text-md text-grayishfaint">
              Not a Member Yet ?{" "}
              <span
                className="text-deepPinkish font-md cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
          <div className="flex mt-4 justify-between items-center flex-col md:flex-row">
            <button
              className="bg-buttonColor text-white text-md px-12  py-3 rounded-md border-none w-full md:w-fit"
              onClick={loginUserButtonHandler}
            >
              Login
            </button>
            <span className="text-grayishfaint">or</span>
            <button
              className="bg-white border-2 border-gray-800 rounded-md px-8 py-2 font-medium flex items-center justify-center text-md w-full md:w-fit"
              onClick={signInWithGoogle}
            >
              Sign in with
              <FcGoogle className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
