import { Button, Space, Dropdown } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/Auth'
import { useNotes } from '../../context/NoteContext'
import Logo from '../Misc/Logo'
import { SettingOutlined, MenuOutlined } from '@ant-design/icons'

const Navbar = () => {
    const { isAuth, handleLogout } = useAuth()
    const { isSidebarCollapsed, setIsSidebarCollapsed, isNoteModalOpen, setSelectedCategory, selectedCategory } = useNotes()
    const navigate = useNavigate()
    const location = useLocation()
    const isHomePage = location.pathname === '/';

    // Hide on scroll logic
    const [isVisible, setIsVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;

            // IF Modal is open, always hide Navbar
            if (isNoteModalOpen) {
                setIsVisible(false);
                return;
            }

            const visible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
            setIsVisible(visible);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, isNoteModalOpen]);

    const items = [
        {
            key: 'logout',
            label: 'Logout',
            danger: true,
            onClick: handleLogout
        }
    ];

    const isDesktopSidebarOpen = isAuth && isHomePage && !isSidebarCollapsed && window.innerWidth >= 992;
    const isNavbarVisible = isVisible && !isNoteModalOpen;

    const navbarStyle = {
        position: 'fixed',
        top: 0,
        left: isDesktopSidebarOpen ? '280px' : 0,
        right: 0,
        zIndex: 1100,
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: isNavbarVisible ? 'translateY(0)' : 'translateY(-100%)',
        minHeight: '64px'
    };

    return (
        <header style={navbarStyle} className="glass-nav d-flex align-items-center">
            <nav className="navbar navbar-expand-lg w-100 py-lg-0" style={{ minHeight: '64px' }}>
                <div className="container-fluid px-3 px-md-4 d-flex flex-wrap align-items-center justify-content-between">
                    {/* Left Side Group */}
                    <div className="d-flex align-items-center gap-2">
                        {isAuth && isHomePage && (
                            <Button
                                type="text"
                                icon={<MenuOutlined style={{ color: 'var(--github-text)', fontSize: '18px' }} />}
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="d-flex align-items-center justify-content-center p-0 hover-scale"
                                style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                            />
                        )}
                        {!isDesktopSidebarOpen && (
                            <div className="navbar-brand m-0 p-0 d-flex align-items-center hover-scale">
                                <Logo />
                            </div>
                        )}
                        {isDesktopSidebarOpen && (
                            <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--github-text)', marginLeft: '6px' }}>
                                Notes
                            </span>
                        )}
                    </div>

                    {/* Right Side Group (Permanent Icons + Toggler) */}
                    <div className="d-flex align-items-center gap-2 order-lg-last">
                        <div className="d-flex align-items-center">
                            {isAuth && (
                                <Dropdown menu={{ items }} placement="bottomRight" arrow trigger={['click']}>
                                    <Button
                                        icon={<SettingOutlined />}
                                        className="d-flex align-items-center justify-content-center border-0 shadow-sm hover-scale"
                                        style={{ height: '40px', width: '40px', borderRadius: '12px', background: 'white' }}
                                    />
                                </Dropdown>
                            )}
                            {!isAuth && (
                                <div className="d-none d-sm-flex gap-2">
                                    <Button
                                        type='text'
                                        className='nav-link-custom fw-600'
                                        onClick={() => { navigate("/auth/login") }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        type='primary'
                                        className='btn-premium'
                                        onClick={() => { navigate("/auth/register") }}
                                    >
                                        Join Now
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Bootstrap Toggler - Always visible below 992px */}
                        <button
                            className="navbar-toggler border-0 shadow-none p-0 ms-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon" style={{ width: '22px', height: '22px' }}></span>
                        </button>
                    </div>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse flex-grow-1" id="navbarSupportedContent">
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-2 gap-lg-4 mt-3 mt-lg-0">
                            <li className="nav-item">
                                <Link
                                    to="/"
                                    onClick={() => {
                                        setSelectedCategory('home');
                                        const collapse = document.getElementById('navbarSupportedContent');
                                        if (collapse && collapse.classList.contains('show')) {
                                            collapse.classList.remove('show');
                                        }
                                    }}
                                    className={`nav-link nav-link-custom px-0 ${location.pathname === '/' && selectedCategory === 'home' ? 'active' : ''}`}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/"
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        const collapse = document.getElementById('navbarSupportedContent');
                                        if (collapse && collapse.classList.contains('show')) {
                                            collapse.classList.remove('show');
                                        }
                                    }}
                                    className={`nav-link nav-link-custom px-0 ${location.pathname === '/' && selectedCategory === 'all' ? 'active' : ''}`}
                                >
                                    All Notes
                                </Link>
                            </li>

                            {/* Mobile Auth Links (only visible on extra small screens) */}
                            {!isAuth && (
                                <li className="nav-item d-sm-none mt-3">
                                    <div className="d-grid gap-2">
                                        <Button type='primary' className='btn-premium w-100' onClick={() => navigate("/auth/register")}>Join Now</Button>
                                        <Button type='text' className='fw-600 w-100' onClick={() => navigate("/auth/login")}>Login</Button>
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </header>

    )
}

export default Navbar
