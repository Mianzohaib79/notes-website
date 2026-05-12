import React from 'react'
import { Col, Row, Space, Input, Button, Divider } from 'antd'
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import Copyright from "./Copyright"

const Footer = () => {
    // Standard full-width style
    const footerStyle = {
        backgroundColor: 'var(--github-secondary-bg)',
        borderTop: '1px solid var(--github-border)',
        paddingTop: '48px',
        paddingBottom: '16px',
        marginTop: 'auto',
        width: '100%',
        transition: 'all 0.3s ease'
    };

    return (
        <footer style={footerStyle} className="px-0">
            <div className='container-fluid px-3 px-md-5'>
                <Row gutter={[32, 32]} className="text-center text-md-start">
                    <Col xs={24} md={8}>
                        <h2 style={{ fontWeight: 'bold', color: 'var(--github-primary)' }}>Notes</h2>
                        <p style={{ color: 'var(--github-muted)', marginTop: '16px', lineHeight: '1.6' }}>
                            Your ultimate digital notebook for organizing thoughts, <br className="d-none d-lg-block" />
                            tracking tasks, and boosting productivity. <br className="d-none d-lg-block" />
                            Simple, secure, and always in sync.
                        </p>
                    </Col>
                    <Col xs={24} md={8} className="d-flex flex-column align-items-center align-items-md-start">
                        <h4 style={{ fontWeight: '600', color: 'var(--github-text)' }}>Stay Connected</h4>
                        <Space size="large" style={{ marginTop: '16px' }} className="social-icons-wrapper">
                            <a href="#" className="social-icon-link" aria-label="GitHub"><GithubOutlined /></a>
                            <a href="#" className="social-icon-link" aria-label="Twitter"><TwitterOutlined /></a>
                            <a href="#" className="social-icon-link" aria-label="LinkedIn"><LinkedinOutlined /></a>
                            <a href="#" className="social-icon-link" aria-label="Instagram"><InstagramOutlined /></a>
                        </Space>
                    </Col>
                    <Col xs={24} md={8}>
                        <h4 style={{ fontWeight: '600', color: 'var(--github-text)' }}>Subscribe</h4>
                        <p style={{ color: 'var(--github-muted)', marginBottom: '12px' }}>Get the latest updates direct to your inbox.</p>
                        <div className="d-flex w-100 gap-2 justify-content-center justify-content-md-start">
                            <Input placeholder="Email address" size="large" style={{ maxWidth: '250px' }} />
                            <Button type="primary" size="large">Join</Button>
                        </div>
                    </Col>
                </Row>
                <Divider style={{ margin: '32px 0 16px 0', borderColor: 'var(--github-border)' }} />
                <div className="text-center pb-2">
                    <Copyright />
                </div>
            </div>
        </footer>
    )
}

export default Footer