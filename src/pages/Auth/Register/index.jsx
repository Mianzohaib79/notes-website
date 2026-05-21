import { Button, Form, Input, Typography } from "antd"
import axios from "axios"
import { useState } from "react"
import Logo from "../../../components/Misc/Logo"

import { Link, useNavigate } from "react-router-dom"

const { Title, Paragraph, Text } = Typography
const { Item } = Form

const initialState = { name: "", email: "", password: "", confirmPassword: "" }


const Register = () => {

    const [state, setState] = useState(initialState)

    const [isProcessing, setIsProcessing] = useState(false)

    const navigate = useNavigate()


    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleRegister = () => {
        let { name, email, password, confirmPassword } = state

        const fullName = name.trim()
        if (name.length < 3) { return window.toastify("please enter your name", "error") }
        if (!window.isValidEmail(email)) { return window.toastify("Please enter your valid email", "error") }
        if (password.length < 6) { return window.toastify("password must be at least 6 chars", "error") }
        if (confirmPassword !== password) { return window.toastify("password not match", "error") }

        const user = { name, email, password }

        setIsProcessing(true)

        const apiUrl = import.meta.env.VITE_API_URL
        axios.post(`${apiUrl}/auth/register`, user)

            .then((res) => {
                const { status, data } = res
                if (status === 201) {
                    window.toastify(data.message, "success")
                    navigate("/auth/login")
                }
            })
            .catch(error => {
                console.error(error)
                return window.toastify("Somethings went wrong", "error")
            })
            .finally(() => {
                setTimeout(() => {
                    setIsProcessing(false)
                }, 500)
            })
    }

    return (
        <main className="auth flex-center fade-in" style={{ height: '100dvh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "12px" }}>
            <div className="w-100 d-flex justify-content-center">
                {/* <div className="text-center mb-5 hover-scale" style={{ cursor: 'pointer' }}>
                    <Logo size="large" />
                </div> */}
                <div className="card shadow-lg border-0 mx-auto" style={{ width: '100%', maxWidth: '430px', borderRadius: '24px', padding: '24px', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
                    <Title level={3} className="text-center mb-2" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>Join the Notes App</Title>
                    <Paragraph className="text-center mb-4" type="secondary">Create your account to start organized thinking</Paragraph>

                    <Form layout="vertical" onFinish={handleRegister} style={{ marginBottom: "0" }}>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Full Name</Text>} required>
                            <Input
                                type="text"
                                size="large"
                                placeholder="Full Name"
                                name="name"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Email Address</Text>} required>
                            <Input
                                type="email"
                                size="large"
                                placeholder="Enter your email"
                                name="email"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Create Password</Text>} required>
                            <Input.Password
                                size="large"
                                placeholder="••••••••"
                                name="password"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>
                        <Item label={<Text strong style={{ fontSize: '14px' }}>Confirm Password</Text>} required>
                            <Input.Password
                                size="large"
                                placeholder="••••••••"
                                name="confirmPassword"
                                onChange={handleChange}
                                className="form-control-premium"
                            />
                        </Item>

                        <div className="text-center mb-4" style={{ fontSize: '13px' }}>
                            <Text type="secondary">Already have an account? </Text>
                            <Link to="/auth/login" style={{ fontWeight: 500 }}>Sign In</Link>
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            htmlType="submit"
                            loading={isProcessing}
                            className="btn-premium py-2 h-auto"
                            style={{ fontSize: '16px' }}
                        >
                            Create Account
                        </Button>
                    </Form>
                </div>
            </div>
        </main>

    )
}

export default Register