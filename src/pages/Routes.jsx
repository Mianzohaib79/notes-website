import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Frontend from "./Frontend"
import Auth from './Auth'
// import Dashboard from './Dashoard'
// import ProtectedRoute from '../components/Misc/protectedRoute'
import { useAuth } from '../context/Auth'

const Index = () => {

    const { isAuth } = useAuth()
    return (
        <Routes>
            <Route path="/*" element={isAuth ? <Frontend /> : <Navigate to="/auth/login" />} />
            <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" />} />
            {/* <Route path="/dashboard/*" element={< ProtectedRoute Component={Dashboard} />} /> */}
        </Routes>
    )
}

export default Index 