import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import "@fortawesome/fontawesome-free/css/all.min.css";


import LandingPage from './assets/LandingPage'
import RegistrationPage from './assets/RegistrationPage'
import LoginPage from './assets/LoginPage'
import { Routes, Route } from 'react-router-dom'
import ResultPage from './assets/ResultPage'
import Reports from './assets/Reports'
import ChangePassword from './assets/ChangePassword'
import MapView from './components/MapView'
import ChatBotDrawer from './components/ChatbotDrawer'
import SideBar from './components/SideBar'
import TopBar from './components/Top-Bar'
import AdminDashboard from './assets/AdminDashboard';
import UserDashboard from './assets/UserDashboard';
import BusinessDashboard from './assets/BusinessDashboard';
import BusinessRegister from './assets/BusinessRegister';
import BusinessStatus from './assets/BusinessStatus';
import BusinessApprovals from './assets/BusinessApprovals';
import Process from './assets/Process';
import AnalyticsPage from './assets/AnalyticsPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/registration' element={<RegistrationPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/admindashboard' element={<AdminDashboard />} />
      <Route path='/userdashboard' element={<UserDashboard />} />
      <Route path='/result/:resultId' element={<ResultPage />} />
      <Route path='/reports' element={<Reports />} />
      <Route path='/changepassword' element={<ChangePassword />} />
      <Route path='/mapview' element={<MapView />} />
      <Route path='/chatbotdrawer' element={<ChatBotDrawer />} />
      <Route path='/sidebar' element={<SideBar />} />
      <Route path='/topbar' element={<TopBar />} />
      <Route path='/business/dashboard' element={<BusinessDashboard />} />
      <Route path="/business/register" element={<BusinessRegister />} />
      <Route path="/business/process" element={<Process />} />
      <Route path="/business/status" element={<BusinessStatus />} />
      <Route path="/admin/business-approvals" element={<BusinessApprovals />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
      
    </>
  )
}

export default App
