import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Nopage from '../../components/Misc/Nopage'
// import ForgotPassword from './ForgotPassword'

const Auth = () => {
    return (
        <>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                {/* <Route path="forgotpassword" element={<ForgotPassword />} /> */}
                <Route path="*" element={<Nopage />} />
            </Routes>


        </>
    )
}

export default Auth