import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from 'yup';

interface ValuesType {
  message: string;
  image_upload: File | null;
  profile_name: string;
}
const EditUserPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<ValuesType | null>(null);
    useEffect(() => {
        fetch(`http://localhost:8081/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(id)
                setPost(data);
            })
            .catch((err) => console.log(err));
    }, [id]);
    
    const initialValues = {
        message: post?.message || '',
        image_upload: null,
    }

    const validationSchema = yup.object({
        message: yup.string().required('Required'),
        image_upload: yup.string().required('Required'),
    }
    );

    console.log("This is the data of posts:",post)
    const onSubmit = () => {
    // Check if formik.values.message is not null or empty
    if (!formik.values.message) {
        console.error('Message is required');
        return;
    }

    const formData = new FormData();
    formData.append('message', formik.values.message);

    // Append image_upload only if it's not null
    if (formik.values.image_upload) {
        formData.append('image_upload', formik.values.image_upload);
    }

    axios
        .put(`http://localhost:8081/posts/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response) => {
            console.log('response: ' + response.data);
            navigate(`/homepage`);
        })
        .catch((error) => {
            console.error('Error during PUT request:', error);
        });
};
    
    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    })
    return (
        <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mt-8">
            {post && (
                <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label
                            htmlFor="message"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Message
                        </label>
                        <input
                            type="text"
                            id="message"
                            name="message"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.message}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {formik.touched.message && formik.errors.message && (
                            <p className="text-red-500 text-xs italic mt-1">
                                {formik.errors.message}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="image_upload"
                            className="block text-gray-700 text-sm font-bold mb-2"
                        >
                            Image Upload
                        </label>
                        <input
                            type="file"
                            id="image_upload"
                            name="image_upload"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    formik.setFieldValue("image_upload", file);
                                }
                            }}
                            onBlur={formik.handleBlur}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        {formik.touched.image_upload && formik.errors.image_upload && (
                            <p className="text-red-500 text-xs italic mt-1">
                                {formik.errors.image_upload}
                            </p>
                        )}
                    </div>
  

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}
        </form>
    )
}
export default EditUserPost
