import { Button, Form, Input, Typography } from "antd"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../../context/Auth"
import { useNavigate } from "react-router-dom"

const { Title, Paragraph } = Typography
const { Item } = Form

const initialState = { email: "" }


const ForgotPassword = () => {

    const { dispatch } = useAuth()


    const [state, setState] = useState(initialState)

    const [isProcessing, setIsProcessing] = useState(false)

    const navigate = useNavigate()


    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleForgotPassword = () => {
        let { email } = state

        console.log('email', email)
        navigate("/")
    }

    return (
        <main className="auth flex-center">
            <div className="container">
                <div className="card p-3 p-4 mx-auto">
                    <Title level={1} className="text-center">Reset Password</Title>
                    <Paragraph className="text-center">Remember Password?<Link to="/auth/login">Login</Link></Paragraph>

                    <Form layout="vertical">

                        <Item label="Email" required>
                            <Input type="email" size="large" placeholder="Enter your email" name="email" onChange={handleChange} />
                        </Item>

                        <Button type="primary" size="large" block htmlType="submit" loading={isProcessing} onClick={handleForgotPassword}>Send Email</Button>
                    </Form>
                </div>
            </div>
        </main>
    )
}


export default ForgotPassword