import { IoMdAddCircleOutline } from "react-icons/io";
import { AddPost } from ".";
import { useEffect, useState } from "react";
import { MdEdit,MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { Link } from "react-router-dom";
import { DeleteModal, LogOutModal } from "../components";
import { AiOutlineMessage } from "react-icons/ai";

interface Post {
  id:number
  user_id: number;
  message: string;
  image_upload: string;
  profile_name: string;
  profile_picture: string;
}
// axios.defaults.withCredentials = false;

const HomePage = () => {
  const [data, setData] = useState<Post[]>([]); 
  
  const [open, setOpen] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [idToDelete,setIdToDelete] = useState<number>(-1);

  const [email, setEamil] = useState();
  const [profPic, setprofPic] = useState();
  useEffect(() => {
    fetch('http://localhost:8083/user-upload')
      .then((rest) => rest.json())
      .then((data) => setData(data.data))
      .catch((err) => console.log(err));
      
    
    axios.get('http://localhost:8083/getcredentials',{withCredentials:true})
      .then(res => {
        setEamil(res.data.profile_name)
        setprofPic(res.data.profile_picture)
      })
      .catch(err => {
        console.log(err)
      });
  }, [profPic]);

   
  function handleClickDelete(id: number,modalDelete:boolean): void {
      setDeleteModal(modalDelete)
      setIdToDelete(id)
  }

  return (
    <>
      <div className="flex flex-col h-screen w-full items-center bg-slate-500">
        <div className="bg-slate-500 w-full absolute flex flex-row items-center justify-between p-4 shadow-md">          
          <div>
            <h2 className="text-xl font-semibold">{email}</h2>
          </div>
          <div className="flex flex-row items-center gap-4">
            <Link to={"/message"} className="rounded-3xl hover:border-[2px] hover:scale-x-110 duration-500"><AiOutlineMessage size={20}/></Link>
          <div className="relative flex flex-col items-center group">
              <img
              className="h-12 w-12 rounded-3xl hover:border-[2px] duration-75 "
              src={`data:image/jpeg;base64,${profPic}`}
              />
              <span className="flex flex-col text-xs font-bold gap-2 absolute top-14 p-2 rounded-lg origin-top scale-y-0 group-hover:scale-100 duration-100 bg-[#E2E8F0]">
                <button type="button" onClick={()=>setLogout(true)}>Logout</button>
              </span>
          </div>
          </div>
        </div>

        <div className="h-full w-full flex flex-col pt-20 overflow-y-auto  ">
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
                    <div className="flex gap-3 py-2">
                      <img
                      className="h-12 w-12 rounded-3xl"
                      src={`data:image/jpeg;base64,${value.profile_picture}`}
                      />
                      <h2 className="text-xl font-semibold">{value.profile_name}</h2>
                    </div>
                    <div className="flex flex-row gap-10">
                      <Link to={`/edit/${value.id}`} ><MdEdit /></Link>
                      <button
                        type="button"
                        onClick={() => handleClickDelete(value.id,true)}><MdDeleteOutline />
                      </button>
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
      {logout ? <LogOutModal closeModal={setLogout} handleLogout={setLogout}/> : null}
      {deleteModal ? <DeleteModal onCancel={setDeleteModal} onDelete={setDeleteModal} id={idToDelete}/> : null} 
    </>
  );
};

export default HomePage;
