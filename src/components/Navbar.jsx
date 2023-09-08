import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
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
  verticalAlign: "center",
  width: "auto",
  
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
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [name, setname] = useState(auth.currentUser?.displayName)
  const [logo, setlogo] = useState(auth.currentUser?.photoURL)
  useEffect(()=>{
  console.log(auth.currentUser)
  if(name == null || name == "" || auth.currentUser == null){navigate('/')}
  setname(auth.currentUser?.displayName)
  setlogo(auth.currentUser?.photoURL)
  
  }, [auth.currentUser, user])
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
              src={logo}
              width="30"
              height="30"
              
              style={{ marginLeft: "10px", marginRight: "10px", borderRadius: "50%", }}
            />
            <div style={{marginRight: "10px",}}>{name}</div>
            
            <button onClick={signUserOut} style={buttonStyle}>
              Sign Out
            </button>
          
        </div>
      )}
    </div>
  );
}

export default Navbar;

