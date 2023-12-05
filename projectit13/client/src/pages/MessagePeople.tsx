import { useEffect, useState } from "react";
import Chat from "./Chat";
import io from 'socket.io-client';
import axios from "axios";

axios.defaults.withCredentials = true;

const socket = io("http://localhost:8083", { path: "/socket.io" });
socket.on("connect", () => {
    console.log("Connected to server");
});
const MessagePeople = () => {
  const [username,setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat,setShowChat] = useState(false);

  const joinRoom = () =>{
    if(username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true)
    }

  };
useEffect(()=>{
  axios.get('http://localhost:8083/getcredentials')
      .then(res => {
        console.log(res);
        console.log('gongskie');
        setUsername(res.data.profile_name)
        console.log(username)
      })
      .catch(err => {
        console.log(err)
      });
})

  return (
    <div className='App'>
      {!showChat ? (
      <div className='joinChatContainer'>
        <h3>Join The Chat</h3>
        <input type="text" placeholder='Room ID...' onChange={
          (event)=>{setRoom(event.target.value)}
          }/>
           <button type='button' onClick={joinRoom}>Join a Room</button>
      </div>
      )
     : (

      <Chat socket={socket} username={username} room={room}/>
      )}
    </div>
  )
}

export default MessagePeople
