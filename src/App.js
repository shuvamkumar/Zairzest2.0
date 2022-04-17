import React from 'react';
import {Routes,Route} from "react-router-dom"
import './App.css';
import Login from './views/Login';
function App() {
  return (
    <div>
      <Routes>
        <Route path="login" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;
