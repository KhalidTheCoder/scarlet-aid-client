import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import toast from "react-hot-toast";
import axios from "axios";
import { auth } from "../firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

   const updateUser = (userInfo) => {
    return updateProfile(auth.currentUser, userInfo);
  };


  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      toast.success("Signed Out Successfully");
    } catch (error) {
      toast.error("Sign out failed: " + error.message);
    }
  };

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
    setUser(loggedInUser);

    if (loggedInUser) {
      
      axios.get("https://scarlet-aid-server.vercel.app/", {
        headers: {
          Authorization: `Bearer ${loggedInUser.accessToken}`,
        },
      })
      .catch((err) => {
        console.error("Token verification failed:", err);
      });
    }

    setLoading(false); 
  });

  return () => unsubscribe();
}, []);

  const authInfo = {
    user,
    setUser,
    loading,
    createUser,
    signInUser,
    updateUser,
    signInWithGoogle,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
