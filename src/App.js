
import './App.css';
import Navbar from "./components/Navbar"
import Home from './components/Home';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login';
import SubmitOrder from './components/SubmitOrder';
import SubmitFile from './components/SubmitFile';
import SignUp from './components/SignUp';
import UsernameUpdate from './components/usernameUpdate';
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/submitorder" element={<SubmitOrder />} />
          <Route path="/submitfile" element={<SubmitFile />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/username-update" element={<UsernameUpdate />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
