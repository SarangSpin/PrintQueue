import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const navbarStyles = {
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const linkStyles = {
  textDecoration: "none",
  color: "#fff",
  margin: "0 10px",
};

const userStyles = {
  display: "flex",
  alignItems: "center",
  alignSelf: "center",
  verticalAlign: "center"
  
  
};
const buttonStyle = {
  backgroundColor: "#4285F4",
  color: "#fff",
  padding: "5px 5px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
}

function Navbar() {
  const [user, loading, error] = useAuthState(auth);

  const signUserOut = async () => {
    await signOut(auth);
  };

  return (
    <div style={navbarStyles}>
      <Link to="/" style={linkStyles}>
        HOME
      </Link>
      {!user ? (
        <Link to="/login" style={linkStyles}>
          LOGIN
        </Link>
      ) : (
        <Link to="/submitorder" style={linkStyles}>
          Submit File
        </Link>
      )}

      {user && (
        <div style={userStyles}>
          
          {/* <div>Username: </div> */}
            <img
              src={user?.photoURL || ""}
              alt="userphoto"
              width="30"
              height="30"
              
              style={{ marginLeft: "10px", marginRight: "10px", borderRadius: "50%", }}
            />
            <div style={{marginRight: "10px"}}>{user?.displayName || ""}</div>
            
            <button onClick={signUserOut} style={buttonStyle}>
              Sign Out
            </button>
          
        </div>
      )}
    </div>
  );
}

export default Navbar;

