import { PrettyChatWindow } from "react-chat-engine-pretty";

interface ChatPageProps {
  user: {
    username: string;
    secret: string;
  };
}

const ChatsPage: React.FC<ChatPageProps> = ({ user }) => {
  console.log("putang ina samoka ani uys:",user.username)
  console.log(user.secret)
  return (
    <div style={{ height: "100vh" }}>
      <PrettyChatWindow
        projectId="d7b84d68-4d9c-4fab-b65e-f0b925d5257c"
        username={user.username}
        secret={user.secret}
        style={{ height: "100%" }}
      />
      {/* <span className="text-red-500">
        {user.username}
        {user.secret}
      </span> */}
    </div>
  );
};

export default ChatsPage;
