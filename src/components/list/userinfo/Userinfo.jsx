// Userinfo.jsx
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { auth } from "../../../lib/firebase";
import { signOut } from "firebase/auth";
import "./userinfo.css";

const Userinfo = () => {
  const { currentUser } = useUserStore();
  const { chatId } = useChatStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("Error logging out: ", error);
    }
  };

  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser.avatar || "/avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="/more.png" alt="" />
        <img src="/video.png" alt="" />
        <img src="/edit.png" alt="" />
        {!chatId && <button onClick={handleLogout}>Logout</button>}
      </div>
    </div>
  );
};

export default Userinfo;
