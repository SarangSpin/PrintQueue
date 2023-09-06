import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div>
      <Link to="/">HOME</Link>
      {!user ? (
        <Link to="/login">LOGIN</Link>
      ) : (
        <Link to="/submitorder">Submit File</Link>
      )}

      {user && (
        <>
          <div>Username: {user?.displayName || ""}</div>
          <div>
            <img
              src={user?.photoURL || ""}
              alt="userphoto"
              width="50"
              height="50"
            />
            <button onClick={signUserOut}>Sign Out</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
