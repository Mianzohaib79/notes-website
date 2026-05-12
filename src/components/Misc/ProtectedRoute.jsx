import { Navigate } from "react-router-dom"
import { useAuth } from "../../context/Auth"

const ProtectedRoute = ({ Component }) => {

    const { isAuth } = useAuth()

    if (!isAuth) return <Navigate to="/auth/login" />
    return (<Component />
    )
}

export default ProtectedRoute