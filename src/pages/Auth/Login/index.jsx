import { Button, Form, Input, Typography } from "antd"
import { useState } from "react"
import { useAuth } from "../../../context/Auth"
import { useNotes } from "../../../context/NoteContext"
import { Link } from "react-router-dom"
import axios from "axios"
import Logo from "../../../components/Misc/Logo"

const { Title, Paragraph, Text } = Typography
const { Item } = Form

const initialState = { email: "", password: "" }


const Login = () => {

    const { readProfile } = useAuth()
    const { setSelectedCategory } = useNotes()


    const [state, setState] = useState(initialState)

    const [isProcessing, setIsProcessing] = useState(false)


    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleLogin = () => {

        let { email, password, } = state

        const userData = { email, password }

        setIsProcessing(true)

        const apiUrl = import.meta.env.VITE_API_URL || "https://notes-website-ba6w.vercel.app";
        axios.post(`${apiUrl}/auth/login`, userData)

            .then((res) => {
                const { status, data } = res
                if (status === 200) {
                    localStorage.setItem("jwt", data.token)
                    if (setSelectedCategory) setSelectedCategory('home')
                    readProfile(data.token)
                    window.toastify("Login successful", "success")
                } else {
                    window.toastify(data.message, "error")
                }
            })
            .catch(error => {
                console.error(error)
                window.toastify(error?.response?.data?.message || "Something went is wrong, Internal server error", "error")
            })
            .finally(() => {
                setIsProcessing(false)
            })

    }

    return (
        <main className="auth flex-center fade-in" style={{ height: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '20px 0', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="container">
                {/* <div className="text-center mb-5 hover-scale" style={{ cursor: 'pointer' }}>
                    <Logo size="large" />
                </div> */}
                <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: '400px', borderRadius: '24px', padding: '32px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                    <Title level={3} className="text-center mb-2" style={{ fontWeight: 700, letterSpacing: '-0.5px', marginBottom: "6px" }}>Welcome Back Notes</Title>
                    <Paragraph className="text-center mb-4" type="secondary">Enter your details to access your workspace</Paragraph>

                    <Form layout="vertical" onFinish={handleLogin}>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Email Address</Text>} required>
                            <Input
                                type="email"
                                size="large"
                                placeholder="name@example.com"
                                name="email"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Password</Text>} required>
                            <Input.Password
                                size="large"
                                placeholder="••••••••"
                                name="password"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>

                        <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '13px' }}>
                            {/* <Link to="/auth/forgot-password" style={{ fontWeight: 500 }}>Forgot Password?</Link> */}
                            <Link to="/auth/register" style={{ fontWeight: 500 }}>Create Account</Link>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            loading={isProcessing}
                            className="btn-premium py-3 h-auto"
                            style={{ fontSize: '16px' }}
                        >
                            Sign In
                        </Button>
                    </Form>
                </div>
            </div>
        </main>

    )
}
export default Login