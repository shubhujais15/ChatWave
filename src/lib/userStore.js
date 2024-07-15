import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) return set({ currentUser: null, isLoading: false });

    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ currentUser: docSnap.data(), isLoading: false });
        updateUserStatus(uid, true); // User is online
      } else {
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.log(err);
      return set({ currentUser: null, isLoading: false });
    }
  },
}));

const updateUserStatus = async (uid, isOnline) => {
  const userStatusRef = doc(db, "users", uid);
  await updateDoc(userStatusRef, {
    online: isOnline,
    lastSeen: serverTimestamp(),
  });
};

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    updateUserStatus(uid, true); // User is online

    window.addEventListener("beforeunload", () => {
      updateUserStatus(uid, false); // User is offline
    });
  }
});
