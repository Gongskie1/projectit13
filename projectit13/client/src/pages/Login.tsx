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
axios.defaults.withCredentials = true;
const onSubmit = async (initialValues: ValuesType) => {
  try {
    const response = await axios.post('http://localhost:8081/auth', initialValues, {
      withCredentials: true,
    });

    if (response.data.exists) {
      console.log('loging inn');
      navigate('homepage');
    } else {
      setLoginError(true);
      console.log('Invalid password or username')
    }

    
  } catch (error) {
    console.error('Login failed:', error);
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
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Libero repellat a aliquid perferendis quia iusto adipisci,
              enim reiciendis reprehenderit nemo non modi odit, unde iste!
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Deserunt quasi aliquam est vitae ut doloribus nesciunt amet possimus recusandae!
              Voluptatibus temporibus perspiciatis quisquam pariatur aut harum quod fuga ullam laborum!
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


