import axios from 'axios'
import React, { createContext, useContext, useEffect, useState } from 'react'

const Auth = createContext()

const initialState = { isAuth: false, user: {} }

const AuthContext = ({ children }) => {

    const [state, setState] = useState(initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)

    const readProfile = (jwt) => {

        const token = localStorage.getItem("jwt") || jwt

        if (!token) { setIsAppLoading(false); return; }

        const apiUrl = import.meta.env.VITE_API_URL || "https://notes-website-ba6w.vercel.app";
        axios.get(`${apiUrl}/auth/user`, { headers: { Authorization: `Bearer ${jwt || token}` } })
            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    setState({ isAuth: true, user: data.user })
                }
            })
            .catch(error => {
                console.error(error)
            })
            .finally(() => {
                setIsAppLoading(false)
            })
    }
    useEffect(() => { readProfile() }, [])

    const handleLogout = () => {
        setState(initialState)
        localStorage.removeItem("jwt")
    }

    return (
        <Auth.Provider value={{ ...state, isAppLoading, handleLogout, dispatch: setState, readProfile }}>
            {children}
        </Auth.Provider>
    )
}

export default AuthContext

export const useAuth = () => useContext(Auth)