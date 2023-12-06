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
        projectId="6e49091d-2d5f-4b89-a94b-ca0a527b67d8"
        username={user.username}
        secret={user.secret}
        style={{ height: "100%" }}
      />
      <span className="text-red-500">
        {user.username}
      {user.secret}
      </span>
    </div>
  );
};

export default ChatsPage;
