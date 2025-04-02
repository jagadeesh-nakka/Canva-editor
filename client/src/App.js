import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import DesignEditor from "./pages/DesignEditor";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/design/new" element={<DesignEditor isNew={true} />} />
          <Route path="/design/:id" element={<DesignEditor />} />
          <Route path="/" element={<Dashboard />} />

          {/* Protected Routes */}
         
            
     
        

          {/* 404 Page */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
