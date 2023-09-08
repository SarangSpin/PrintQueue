import React from "react";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../config/minimal-theme-switcher.js"
import "../css/loginpage.css"
import "../css/picocss.css"

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const buttonStyle = {
  backgroundColor: "#4285F4",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

function Login() {
  const navigate = useNavigate();
  const gUrl = "../img/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png";
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/");
  };

  return (
    <>
      <div>
    {/*!-- Nav*/} 
    {/* <nav className="container-fluid">
      <ul>
        <li>
          <a href="./" className="contrast" onclick="event.preventDefault()"><strong>Charvi</strong></a>
        </li>
      </ul>
      <ul>
        <li>
          <details role="list" dir="rtl">
            <summary aria-haspopup="listbox" role="link" className="secondary">Theme</summary>
            <ul role="listbox">
              <li><a href="#" data-theme-switcher="auto">Auto</a></li>
              <li><a href="#" data-theme-switcher="light">Light</a></li>
              <li><a href="#" data-theme-switcher="dark">Dark</a></li>
            </ul>
          </details>
        </li>
        <li>
          <details role="list" dir="rtl">
            <summary aria-haspopup="listbox" role="link" className="secondary">Examples (v1)</summary>
            <ul role="listbox">
              <li><a href="../v1-preview/">Preview</a></li>
              <li><a href="../v1-preview-rtl/">Right-to-left</a></li>
              <li><a href="../v1-classless/">Classless</a></li>
              <li><a href="../v1-basic-template/">Basic template</a></li>
              <li><a href="../v1-company/">Company</a></li>
              <li><a href="../v1-google-amp/">Google Amp</a></li>
              <li><a href="../v1-sign-in/">Sign in</a></li>
              <li><a href="../v1-bootstrap-grid/">Bootstrap grid</a></li>
            </ul>
          </details>
        </li>
      </ul>
    </nav> */}
    

    {/* <!-- Main --> */}
    <main className="container">
      <article className="grid">
        <div>
          <hgroup className="animate-character">
            <h1>Sign in</h1>
            <h2></h2>

          </hgroup>
          <form>
            <input
              type="text"
              name="login"
              placeholder="Phone number"
              aria-label="Login"
              autocomplete="nickname"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autocomplete="current-password"
              required
            />
            <fieldset>
              <label for="remember">
                <input type="checkbox" role="switch" id="remember" name="remember" />
                Remember me
              </label>
            </fieldset>
            <button type="submit" className="contrast" onclick="event.preventDefault()" >Login</button>
          </form>
          <hgroup className="animate-character">
            <h1>Or</h1>
            <h2></h2>
            <button className="contrast" style={{marginTop: "10px"}} onClick={signInWithGoogle}>
              <img src={require("../img/png-transparent-google-logo-g-suite-google-guava-google-plus-company-text-logo.png")} 
              alt="logo" width="25"
              height="25"
               />
               <div style={{margin: "15px", padding: "0px"}}> Sign in with Google</div>
       
      </button>
          </hgroup>
        </div>

        
      </article>
    </main>
    {/* <!-- ./ Main --> */}

    {/* <!-- Footer -->
    <footer className="container-fluid">
      <small
        >Built with <a href="https://picocss.com" className="secondary">Pico</a> •
        <a href="https://github.com/picocss/examples/tree/master/v1-sign-in/" className="secondary"
          >Source code</a
        ></small
      >
    </footer>
    <!-- ./ Footer --> */}
{/* 
    <!-- Minimal theme switcher --> */}
    {/* <script src="js/minimal-theme-switcher.js"></script> */}
  </div>
    {/* <div style={containerStyle}>
      <p>Sign in with Google to continue</p>
      <button style={buttonStyle} onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </div> */}
    </>
  );
}

export default Login;
