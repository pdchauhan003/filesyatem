import React from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './componants/Home'
import Files from './componants/Files';
import UserFolders from './componants/UserFolder';
import Upload from './componants/Upload';
import dotenv from "dotenv";
dotenv.config();
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/user/:username" element={<UserFolders />} />
          <Route path="/user/:username/:type" element={<Files />} />
        </Routes>
      </BrowserRouter>
      {/* <h2>Hello</h2> */}
    </>
  )
}
export default App
