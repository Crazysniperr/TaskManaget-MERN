import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/landingPage/LandingPage';
import LoginPage from './pages/loginPage/LoginPage';
import RegisterPage from './pages/registerPage/RegisterPage';
import TaskPage from './pages/TaskPage/TaskPage';
import NewList from './pages/newList/NewList';
import NewTask from './pages/newTask/NewTask';
// import Topbar from './components/topbar/Topbar';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user/login" element={<LoginPage />} />
          <Route path="/user" element={<RegisterPage />} />
          <Route path="/TaskManager" element={<TaskPage />} />
          <Route path="/NewList" element={<NewList />} />
          <Route path="/lists/:listId/NewTask" element={<NewTask />} />
          <Route path="/lists/:listId" element={<TaskPage />} />
          <Route path="/lists/:listId/:taskId" element={<TaskPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;