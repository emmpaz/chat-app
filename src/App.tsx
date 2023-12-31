import React from 'react';
import './App.css';
import Home from './Home';
import {
  BrowserRouter, Routes, Route
} from "react-router-dom";


const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
  </BrowserRouter>
);

export default App;