import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './pages/Dashboard';
import axios from 'axios';
function App() {
  
  axios.interceptors.response.use(response => {
    return response;
 }, error => {
   if (error.response.status === 401) {
    setTimeout(()=>{ window.location.href = "/"}, 2000);
   }
   return error;
 });
  return (
    <>
    <Router>
        <Routes>
          <Route  path="/" element={<Login />}/>
          <Route  path="/dashboard" element={<Dashboard />}/>
        </Routes>
    </Router>
    </>
  );
}

export default App;
