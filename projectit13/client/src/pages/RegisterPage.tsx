import { IoMdPerson } from "react-icons/io"
import { CustomButton, CustomInput } from "../components"
import { CiLock } from "react-icons/ci"
import { IoMailOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from 'yup';
import axios from "axios";
import { useState } from "react";

interface valuesType {
  email: string,
  username: string,
  password: string
}

const RegisterPage = () => {
  const [emailExist, setEmailExist] = useState<boolean>(false);
  const navigate = useNavigate();
  const initialValues = {
    email: '',
    username: '',
    password: '',
    cpassword:''
  };
  
  const onSubmit = async (initialValues: valuesType) => {
    const check = await axios.get('http://localhost:8081/check', {
    params: {
      email: initialValues.email,
    },
    });

    const value = localStorage.getItem(formik.values.email);
    value !== null ? setEmailExist(true) : setEmailExist(false);
    const dataExists = check.data.exists === true; 

    // console.log(dataExists)
    if (dataExists) {
      console.log(dataExists, value);
      localStorage.setItem(initialValues.email, String(dataExists));
    } else {
      axios.post('http://localhost:8081register', initialValues);
      navigate('/');
    }
      
        
    
  };

  const validationSchema = yup.object({
    email: yup.string().email('Inavalid Input Email').required('Required'),
    username: yup.string().min(4, 'Minimum 4 characters').required('Required'),
    password: yup.string().min(6, "Minimum 6 characters").required('Required'),
    cpassword: yup.string().required('Required').oneOf([yup.ref('password')], 'Password must match')
  })
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema

  }); 
  return (
    <div className="flex h-screen bg-[#201D22] p-10 ">
      <div className=" h-full w-full bg-[#2C282E] rounded-xl flex p-2">
        <div className="flex-1 bg-[#753EC9] rounded-lg text-white font-bold">
            <div className="pl-4 pt-4">
                <h1 className="text-4xl">Register your account</h1>
                <h2 className="text-2xl">Blog you thaught</h2>
            </div>
        </div>
        <div className="flex-1 ">
          <form
            onSubmit={formik.handleSubmit}
            className="p-[20px_40px]">
              
                <div className="flex justify-between">
                    <h2 className="font-semibold text-white text-lg text-center mb-5">REGSITER YOUR ACCOUNT</h2>
                    <p>Already haved account? <Link to={"/"} className="text-[purple]"> login</Link></p>
                </div>
                
                <div className="">
                  <label 
                  htmlFor=""
                  className="text-white font-semibold text-sm">EMAIL</label>
                  <div className="flex items-center  bg-[rgb(211,211,211)] rounded-xl p-[8px_8px] mb-3">
                    <span className="border-r-[1px] border-[black] pr-1 mr-1">
                    <IoMailOutline />
                    </span>
                    <CustomInput  
                    styles="rounded-[20px] bg-[lightgray]" 
                    type="email"
                    placeholder="email"
                    name='email'
                    values={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && <div className="text-red-600">{formik.errors.email}</div>}
                  {emailExist == true && <div className="text-red-600">email exist</div>}
                </div>      

                <div className="">
                  <label 
                  htmlFor=""
                  className="text-white font-semibold text-sm">USERNAME</label>
                  <div className="flex items-center  bg-[rgb(211,211,211)] rounded-xl p-[8px_8px] mb-3">
                    <span className="border-r-[1px] border-[black] pr-1 mr-1">
                    <IoMdPerson />
                    </span>
                    <CustomInput  
                    styles="rounded-[20px] bg-[lightgray]" 
                    type="text"
                    placeholder="username"
                    name='username'
                    values={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                    
                  </div>
                  {formik.touched.username && formik.errors.username && <div className="text-red-600">{formik.errors.username}</div>}
                </div>
                
                <div className="">
                  <label 
                  htmlFor=""
                  className="text-white font-semibold text-sm">PASSWORD</label>
                  <div className="flex items-center  bg-[rgb(211,211,211)] rounded-xl p-[8px_8px] mb-3">
                    <span className="border-r-[1px] border-[black] pr-1 mr-1">
                    <CiLock />
                    </span>
                    <CustomInput  
                    styles="rounded-[20px] bg-[lightgray] w-full" 
                    type="password"
                    placeholder="password" 
                    name='password'
                    values={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.password && formik.errors.password && <div className="text-red-600">{formik.errors.password}</div>}
                </div>
                
                <div className="">
                  <label 
                  htmlFor=""
                  className="text-white font-semibold text-sm">PASSWORD</label>
                  <div className="flex items-center  bg-[rgb(211,211,211)] rounded-xl p-[8px_8px] mb-3">
                    <span className="border-r-[1px] border-[black] pr-1 mr-1">
                    <CiLock />
                    </span>
                    <CustomInput  
                    styles="rounded-[20px] bg-[lightgray] w-full" 
                    type="cpassword"
                    placeholder="cpassword" 
                    name='cpassword'
                    values={formik.values.cpassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.cpassword && formik.errors.cpassword && <div className="text-red-600">{formik.errors.cpassword}</div>}
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
  )
}

export default RegisterPage
