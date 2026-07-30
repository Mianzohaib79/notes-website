import React, { useState, useEffect } from 'react'
import { Col, Row, Space, Button, Divider, Tag } from 'antd'
import { GithubOutlined, TwitterOutlined, LinkedinOutlined, InstagramOutlined, ArrowUpOutlined, MailOutlined, RightOutlined, ThunderboltOutlined, LockOutlined, SmileOutlined } from '@ant-design/icons'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/Auth'
import { useNotes } from '../../context/NoteContext'
import Logo from '../Misc/Logo'
import Copyright from "./Copyright"

const Footer = () => {
    const { isAuth } = useAuth();
    const { isSidebarCollapsed, setSelectedCategory } = useNotes();
    const location = useLocation();

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 992);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isHomePage = location.pathname === '/';
    const isDesktopSidebarOpen = isAuth && isHomePage && !isSidebarCollapsed && isDesktop;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const footerStyle = {
        backgroundColor: '#fff',
        borderTop: '1px solid var(--github-border)',
        paddingTop: '44px',
        paddingBottom: '20px',
        marginTop: 'auto',
        marginLeft: isDesktopSidebarOpen ? '280px' : 0,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -4px 20px rgba(15, 23, 42, 0.02)'
    };

    return (
        <footer style={footerStyle} className="px-0">
            <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 32px' }}>
                <Row gutter={[32, 32]} className="justify-content-between">
                    {/* Col 1: Brand & Feature Badges */}
                    <Col xs={24} md={8}>
                        <div className="d-flex align-items-center mb-3">
                            <Logo />
                        </div>
                        <p style={{ color: 'var(--github-muted)', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px', maxWidth: '320px' }}>
                            Your ultimate digital workspace for capturing ideas, organizing thoughts, and boosting daily productivity with seamless sync.
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                            <Tag icon={<ThunderboltOutlined />} color="blue" style={{ borderRadius: '20px', padding: '2px 10px' }}>Fast Sync</Tag>
                            <Tag icon={<LockOutlined />} color="green" style={{ borderRadius: '20px', padding: '2px 10px' }}>Secure</Tag>
                            <Tag icon={<SmileOutlined />} color="purple" style={{ borderRadius: '20px', padding: '2px 10px' }}>Modern UI</Tag>
                        </div>
                    </Col>

                    {/* Col 2: Navigation Links */}
                    <Col xs={24} sm={12} md={8} className="d-flex flex-column align-items-start align-items-md-center">
                        <div>
                            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'var(--github-text)', letterSpacing: '0.8px', marginBottom: '16px', textTransform: 'uppercase' }}>
                                Quick Navigation
                            </h4>
                            <div className="d-flex flex-column gap-2">
                                {[
                                    { title: 'Home', category: 'home' },
                                    { title: 'All Notes', category: 'all' },
                                    { title: 'Favorites', category: 'favorites' },
                                    { title: 'Shared with me', category: 'shared' },
                                    { title: 'Folders', category: 'folders' },
                                    { title: 'Trash', category: 'trash' }
                                ].map((item, idx) => (
                                    <Link
                                        key={idx}
                                        to="/"
                                        onClick={() => {
                                            if (setSelectedCategory) setSelectedCategory(item.category);
                                            scrollToTop();
                                        }}
                                        className="d-flex align-items-center gap-2 footer-link"
                                        style={{
                                            color: 'var(--github-muted)',
                                            fontSize: '13.5px',
                                            textDecoration: 'none',
                                            width: 'fit-content',
                                            transition: 'all 0.25s ease'
                                        }}
                                    >
                                        <RightOutlined style={{ fontSize: '10px', color: 'var(--github-primary)' }} />
                                        <span>{item.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {/* Col 3: Social Badges & Support Contact */}
                    <Col xs={24} sm={12} md={8} className="d-flex flex-column align-items-start align-items-md-end text-md-end">
                        <div style={{ textAlign: 'left' }}>
                            <h4 style={{ fontWeight: '700', fontSize: '13px', color: 'var(--github-text)', letterSpacing: '0.8px', marginBottom: '16px', textTransform: 'uppercase' }}>
                                Connect With Us
                            </h4>
                            <p style={{ color: 'var(--github-muted)', fontSize: '13px', marginBottom: '16px', maxWidth: '280px' }}>
                                Stay updated with feature releases and productivity tips.
                            </p>
                            <Space size="middle" className="mb-3">
                                {[
                                    { icon: <GithubOutlined />, label: 'GitHub', href: '#' },
                                    { icon: <TwitterOutlined />, label: 'Twitter', href: '#' },
                                    { icon: <LinkedinOutlined />, label: 'LinkedIn', href: '#' },
                                    { icon: <InstagramOutlined />, label: 'Instagram', href: '#' }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="social-hover-btn d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '12px',
                                            backgroundColor: '#f1f5f9',
                                            color: '#334155',
                                            fontSize: '17px',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </Space>
                            <div className="d-flex align-items-center gap-2 p-2 px-3 mt-2" style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', width: 'fit-content' }}>
                                <MailOutlined style={{ color: 'var(--github-primary)', fontSize: '15px' }} />
                                <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569' }}>support@notesapp.com</span>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: '32px 0 20px 0', borderColor: 'var(--github-border)' }} />

                {/* Bottom Row: Copyright + Back to Top */}
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 pb-2">
                    <Copyright />
                    <Button
                        type="text"
                        onClick={scrollToTop}
                        icon={<ArrowUpOutlined />}
                        className="d-flex align-items-center gap-1 text-secondary hover-scale"
                        style={{ fontSize: '13px', fontWeight: '600', borderRadius: '8px', padding: '6px 12px' }}
                    >
                        Back to top
                    </Button>
                </div>
            </div>
        </footer>
    )
}

export default Footer
