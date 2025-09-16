import React from 'react'
import{Route,Routes} from "react-router-dom"
import NavBar from './components/NavBar'
import HomePage from "./pages/HomePage"
import SettingsPage from "./pages/SettingsPage"
import SignUpPage from "./pages/SignUpPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <div>
      
      <NavBar/>

      <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/signup' element={<SignUpPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/settings' element={<SettingsPage/>} />
          <Route path='/profile' element={<ProfilePage/>} />
      </Routes>

    </div>
  )
}

export default App