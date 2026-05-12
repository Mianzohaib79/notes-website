import React from 'react'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/Auth'

const { Title, Paragraph } = Typography

const Settings = () => {
    const navigate = useNavigate()
    const { handleLogout } = useAuth()

    return (
        <div className="page-hero flex-center" style={{ minHeight: '100vh', padding: '40px 0' }}>
            <div className="container d-flex justify-content-center">
                <div className="card text-center" style={{ width: '100%', maxWidth: '400px' }}>
                    <Title level={2} style={{ color: 'var(--github-primary)' }}>Account Settings</Title>
                    <Paragraph className="mb-4" style={{ color: 'var(--github-muted)' }}>
                        Manage your workspace and session.
                    </Paragraph>
                    <div className="d-flex flex-column gap-3">
                        <Button type="primary" size="large" block onClick={() => navigate("/dashboard")}>
                            Go to Dashboard
                        </Button>
                        <Button type="default" size="large" danger block onClick={handleLogout}>
                            Logout Securely
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings
