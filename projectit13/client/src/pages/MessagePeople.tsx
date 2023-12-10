import { useEffect, useState } from "react";
import { AuthPage, ChatsPage } from ".";
import axios from "axios";
// import axios from "axios";

const MessagePeople = () => {
   const [user, setUser] = useState<{ username: string; secret: string }>({
    username: "",
    secret: "",
  });

   useEffect(()=>{
    axios.get('http://localhost:8083/getcredentials',{withCredentials:true})
      .then(res => {
        setUser({
          username: res.data.username,
          secret: res.data.password,
        });
      })
      .catch(err => {
        console.log(err)
      });
  },[]);


  if (!user || !user.username || !user.secret) {
    return <AuthPage onAuth={(user) => setUser(user)} />
  }else{
    return <ChatsPage user={user} />;
  }
};

export default MessagePeople;
