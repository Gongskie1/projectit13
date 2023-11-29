import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

interface logout {
  handleLogout: Dispatch<SetStateAction<boolean>>;
  closeModal: Dispatch<SetStateAction<boolean>>;
}
const LogOutModal = ({handleLogout,closeModal}:logout) => {
  return (
    <div className="absolute bottom-0 top-0 left-0 right-0 bg-[lightgray] bg-opacity-50 backdrop-blur-md flex items-center justify-center">
  <div className="bg-white rounded-lg p-8 max-w-md">
    <h2 className="text-2xl font-bold mb-4">Logout Confirmation</h2>
    <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
    
    <div className="flex justify-end">
      <Link className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2" onClick={()=>handleLogout(false)} to={"/"}>
        Logout
      </Link>
      <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md" onClick={()=>closeModal(false)}>
        Cancel
      </button>
    </div>
  </div>
</div>
  )
}

export default LogOutModal
