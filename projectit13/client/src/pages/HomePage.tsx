import { IoMdAddCircleOutline } from "react-icons/io";
import { AddPost } from ".";
import { useEffect, useState } from "react";
import { MdEdit,MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";

interface Post {
  id:number
  user_id: number;
  message: string;
  image_upload: string;
  profile_name: string;
}
axios.defaults.withCredentials = true;

const HomePage = () => {
  const [data, setData] = useState<Post[]>([]); 
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEamil] = useState();
  const [profPic, setprofPic] = useState();
  useEffect(() => {
    fetch('http://localhost:8081/user-upload')
      .then((rest) => rest.json())
      .then((data) => setData(data.data))
      .catch((err) => console.log(err));
    
    axios.get('http://localhost:8081/getcredentials')
      .then(res => {
        // console.log(res.data.profile_name)
        setEamil(res.data.profile_name)
        setprofPic(res.data.image_upload)
      })
      .catch(err => {
        console.log(err)
      });
  }, []);

   
  function handleClickDelete(id: number): void {
    axios.delete(`http://localhost:8081/delete/${id}`)
        .then((response) => {
          console.log('response: ' + response.data);
          window.location.reload();
        });
  }

  return (
    <>
      <div className="flex flex-col h-screen w-full items-center bg-slate-500">
        <div className="bg-slate-500 w-full absolute flex flex-row items-center justify-between p-4 
        ">
          
          <div>
            <h2 className="text-xl font-semibold">{email}</h2>
          </div>
          <img
            className="h-12 w-12 rounded-3xl"
            src={`data:image/jpeg;base64,${profPic}`}
          />
        </div>

        <div className="h-full w-full flex flex-col pt-40 overflow-y-auto  ">
          <div className="w-full  flex flex-row justify-center p-5">
            <button
              type="submit"
              className="flex flex-row items-center justify-between border-[1px]
               border-black w-6/12 p-[10px_14px] rounded-3xl shadow-[0px_0px_20px_-3px]
               "
              onClick={() => setOpen(true)}
            >
              <h3>Add Post</h3>
              <span className="text-xl"><IoMdAddCircleOutline /></span>
            </button>
          </div>
          <div className="flex flex-col gap-4  items-center h-full mb-10">
            
            {data.map((value) => (
              <div
                className="border-[1px] border-black rounded-lg w-[700px]  bg-slate-200"
                key={value.id}
              > 
                <div className="">
                  <div className="flex flex-row justify-between items-center px-2 border-b-[1px] border-black my-2">
                    <div className="flex gap-3">
                      <h2 className="text-xl font-semibold">{value.profile_name}</h2>
                    </div>
                    <div className="flex flex-row gap-10">
                      <Link to={`/edit/${value.id}`} ><MdEdit /></Link>
                      <button
                        type="button"
                        onClick={() => handleClickDelete(value.id)}><MdDeleteOutline /></button>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="pb-1">{value.message}</p>
                    <img
                      className="h-full w-full rounded-b-lg"
                      src={`data:image/jpeg;base64,${value.image_upload}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
       
        </div> 
      </div>
      {open ? <AddPost openModal={open} closeModal={setOpen} /> : null}
    </>
  );
};

export default HomePage;
