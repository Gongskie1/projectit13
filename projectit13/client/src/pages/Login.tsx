import { CustomButton, CustomInput } from "../components";
import { IoMdPerson } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { useState } from "react";

interface ValuesType {
  username: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
    const [loginError, setLoginError] = useState<boolean>(false);

  const validationSchema = yup.object({
    username: yup.string().required('Required'),
    password: yup.string().required('Required'),
  });

  const initialValues: ValuesType = {
    username: '',
    password: '',
  };
// axios.defaults.withCredentials = false;
const onSubmit = async (initialValues: ValuesType) => {
    const response = await axios.post('http://localhost:8083/auth', initialValues, { withCredentials: true }  );
    // console.log(response.data.exists);
    if (response.data.exists) {
      console.log('logging inn');
      navigate('homepage');
    } else {
      setLoginError(true);
      console.log('Invalid password or username');
    }
};

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <div className="h-screen p-10 bg-[#201D22]">
      <div className="h-full flex bg-[#2C282E] shadow-2xl p-3 rounded-3xl">
        <div className="flex-[3] bg-[#753EC9]  p-[100px_75px]  rounded-xl">
          <div className="h-full text-white font-bold">
            <h1 className="text-5xl">Post your blog</h1>
            <p className="text-sm">
             INTERACTIVE BLOG POST

            CRUD OPERATION:<br />

            1. Creators can create, update, retrieve, and delete blogs. <br />

            2. Updating blog contents can be done with styles, uploading image or video in either stored, or from an internet resource and video links like Youtube, etc.<br />

            3. Creators can also delete their blogs too.<br />


            LOGIN, REGISTRATION, SESSION, and FORM VALIDATION<br />

            1. Login requires a username or an email and a password of course. Once signed in, it stores localstorage and login session. Formik validation is also implemented in textfields, including formik validation in the blog’s input content.<br />


            OPERATION/PROCESS BASED ON TITLE

            Users can browse and view blogs based on their titles.
            Creators can initiate the creation of a new blog post.
            Authors can edit the content of their existing blogs.
            Authors have the ability to delete their blogs.


            EXTRA FEATURES WHICH ARE NOT DISCUSSED:

            Image Upload and Save. - Image upload is possible in both account details, blog posts, and global socket.io realtime chat, including chat deletions, 

            Image to longtext conversion and reversal

            </p>
          </div>
        </div>
        <div className="flex-[2] bg-[#] flex justify-center items-center">
          <form onSubmit={formik.handleSubmit}>
            <h2 className="font-semibold text-lg text-center  mb-5">USER LOGIN</h2>

            <div className="flex items-center  bg-[lightgray] rounded-xl p-[8px_8px] mb-3">
              <span className="border-r-[1px] border-[black] pr-1 mr-1">
                <IoMdPerson />
              </span>
              <CustomInput
                styles="rounded-[20px] bg-[lightgray]"
                type="text"
                placeholder="username"
                name="username"
                values={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
             
            </div>
             {formik.touched.username && formik.errors.username && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.username}</div>
            )}
            {loginError && (
              <div className="text-red-500 text-sm mb-2">Invalid username or password</div>
            )}
            <div className="flex items-center  bg-[rgb(211,211,211)] rounded-xl p-[8px_8px] mb-3">
              <span className="border-r-[1px] border-[black] pr-1 mr-1">
                <CiLock />
              </span>
              
              <CustomInput
                styles="rounded-[20px] bg-[lightgray]"
                type="password"
                placeholder="password"
                name="password"
                values={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              
            </div>
                {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mb-2">{formik.errors.password}</div>
            )}
            {loginError && (
              <div className="text-red-500 text-sm mb-2">Invalid username or password</div>
            )}
            <div>
              <Link to="register" className="text-xs text-[purple]">
                Don't have an Account?
              </Link>
            </div>
            <CustomButton
              styles={"text-center w-full mt-2 p-[8px_12px] bg-[#7743DB] text-white rounded-full"}
              btnText={"LOGIN"}
              btntype={"submit"}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;


