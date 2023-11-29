import axios from "axios";
import { Dispatch, SetStateAction } from "react";

interface DeleteModalProps {
  onDelete: Dispatch<SetStateAction<boolean>>;
  onCancel: Dispatch<SetStateAction<boolean>>;
  id:number;
}
const deletePost = (id: number) => {
    axios.delete(`http://localhost:8081/delete/${id}`)
        .then((response) => {
          console.log('response: ' + response.data);
          window.location.reload();
        });
}
const DeleteModal = ({ onDelete, onCancel,id }:DeleteModalProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Delete Confirmation</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to delete this item?</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={() => {
              deletePost(id)
              onDelete(false)
            }}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={() => {
              onCancel(false);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
