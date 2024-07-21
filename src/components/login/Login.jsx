import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "../../lib/upload";
import { useUserStore } from "../../lib/userStore"; // Import user store

const Login = () => {
  const { fetchUserInfo } = useUserStore(); // Use fetchUserInfo from user store
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
  
    // VALIDATE INPUTS
    if (!username || !email || !password) return toast.warn("Please enter inputs!");
  
    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }
  
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      let imgUrl;
  
      // Check if avatar file is provided
      if (avatar.file) {
        imgUrl = await upload(avatar.file);
      } else {
        // Use default avatar if no file is uploaded
        imgUrl = "./avatar.png";
      }
  
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
  
      toast.success("Account created successfully");
      fetchUserInfo(res.user.uid); // Fetch user info after registration
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful");
      fetchUserInfo(res.user.uid); // Fetch user info after login
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="login">
        <div className="header">
        <h2>ChatWave</h2>
        <img src="./favicon.png" alt="" />
      </div>
        <div className="item">
            <h2>Welcome back</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
            </form>
        </div>

        <div className="seperator"></div>

        <div className="item">
        <h2>Create an Account</h2>
            <form onSubmit={handleRegister}>
                
                <label htmlFor="file">
                <img src={avatar.url || "./avatar.png"} alt="" />
                Upload an image</label>

                <input type="file" id="file" style={{display:"none"}} onChange={handleAvatar}/>
                <input type="text" placeholder="Username" name="username"/>
                <input type="text" placeholder="Email" name="email" />
                <input type="password" placeholder="Password" name="password" />
                <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>

            </form>
        </div>
    </div>
  )
}

export default Login