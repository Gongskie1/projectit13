import { editProfile } from "../constants"

const EditProfilePage = () => {
  return (
    <div className="h-screen w-full flex flex-row   bg-[#22223b]">
      <div className="">
        
      </div>
      
      <div className="flex py-5 gap-9 w-full h-full pr-10">

        <div className="flex-[2] flex flex-col items-center bg-[#4a4e69] rounded-xl p-[20px_50px]">

          <div className="pt-10 flex flex-col items-center">
            <div className="w-[100px] h-[100px] bg-black rounded-full">
              <img src="" alt="" />
            </div>
            <h2 className="text-[#f2e9e4]">Mark Joseph</h2>
            <h2 className="text-[#22223b]">m.tiempo.528866@umindanao.edu.ph</h2>
          </div>

          <div className="w-full text-center pt-20">
            <div className="">
              <h2 className="text-[#f2e9e4] font-bold text-xl">About</h2>
              <p className="text-[#22223b] break-words px-5 mt-2">I'm Yuki. Full Stack Designer I enjoy creating user-centric,
                delightful and human experiences</p>
            </div>
          </div>
        </div>
        
        <div className="flex-[4] bg-[#4a4e69] rounded-xl p-10">
            
            <div className="flex flex-row justify-between items-center  bg-[#4a4e69]">
                <h2 className="text-4xl text-[#f2e9e4]">Edit profile</h2>
                <div className="h-16 w-16 bg-[lightgray] rounded-full">

                </div>
            </div>
            
            <div className="flex flex-col gap-4">
              {editProfile.map((values)=>
                
                  <div className="flex flex-col w-full text-[#f2e9e4]">
                  <span>{ values.inputName }</span>
                      <input 
                      type={ values.inputType }
                      className=" outline-none bg-transparent p-[5px_8px] border-[1px] border-[#f2e9e4] rounded-md"
                      placeholder="Mark Joseph"/>
                  </div>
               
              )
                
              }
                
                
            </div>
            
        </div>

      </div>
      
    </div>
  )
}

export default EditProfilePage
