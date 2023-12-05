import axios from "axios";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { CiLocationArrow1 } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
// import { useNavigate } from "react-router-dom";

interface valuesType {
  message: string;
  imageUpload: File | null;
}
interface isOpen {
  closeModal: Dispatch<SetStateAction<boolean>>
  openModal: boolean;
}
const AddPost = ({ openModal, closeModal }: isOpen) => {
  // const navigate = useNavigate();
  const initialValues: valuesType = {
    message: "",
    imageUpload: null,
  };

  const onSubmit = async (values: valuesType) => {
    try {
      const formData = new FormData();
      formData.append("message", values.message);
      formData.append("imageUpload", values.imageUpload as File);

      console.log("FormData before sending:", values);

      await axios.post("http://localhost:8083/upload", formData);
      window.location.reload();
      closeModal(false)
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <div className={`${openModal ? ' block' : 'hidden'} absolute top-0 right-0 left-0 bottom-0 bg-neutral-400 bg-opacity-40 backdrop-blur-md`}>
      <button
            type="button"
            className="text-3xl absolute right-4 top-4 z-50"
            onClick={()=> closeModal(false)}
          >
            <IoMdCloseCircle />
          </button>
      <div className="flex flex-row justify-center relative">
        <div className="mt-10 bg-slate-500 w-1/2">
          <form onSubmit={formik.handleSubmit}>
            <div className="relative">
              <textarea
                name="message"
                className="w-full p-2"
                id="message"
                placeholder="Post your thought"
                value={formik.values.message}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              <button
                type="submit"
                className="absolute bottom-2 right-2 text-xl">
                <CiLocationArrow1 />
              </button>
            </div>
            <div>
              <input
                type="file"
                id="imageUpload"
                name="imageUpload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    formik.setFieldValue("imageUpload", file);
                  }
                }}
                required
                onBlur={formik.handleBlur}
              />
            </div>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default AddPost;
