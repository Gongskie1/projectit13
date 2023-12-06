import { useState } from "react";
import { AuthPage, ChatsPage } from ".";
// import axios from "axios";

const MessagePeople = () => {
   const [user, setUser] = useState<{ username: string; secret: string }>({
    username: "",
    secret: "",
  });


  if (!user || !user.username || !user.secret) {
    return <AuthPage onAuth={(user) => setUser(user)} />
  }else{
    return <ChatsPage user={user} />;
  }
};

export default MessagePeople;
