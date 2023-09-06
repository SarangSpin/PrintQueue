
import './App.css';
import Navbar from "./components/Navbar"
import Home from './components/Home';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/Login';
import SubmitOrder from './components/SubmitOrder';
import SubmitFile from './components/SubmitFile';
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
