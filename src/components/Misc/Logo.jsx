import React from 'react';
import { Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../context/NoteContext';

const Logo = ({ size = 'normal' }) => {
    const navigate = useNavigate();
    const { setSelectedCategory } = useNotes();

    // scale styles based on size
    const fontSize = size === 'large' ? '2.5rem' : '1.5rem';

    const handleClick = (e) => {
        e.preventDefault();
        setSelectedCategory('home'); // Reset to home category to show "Create Note"
        navigate('/');
    };

    return (
        <span
            className="brand-logo"
            onClick={handleClick}
            style={{ fontSize, cursor: 'pointer', display: 'inline-block' }}
        >
            <Space align="center" size="small">
                <span className="logo-icon" style={{ display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>📓</span>
                <span className="logo-text fw-bold">Notes</span>
            </Space>
        </span>
    );
};

export default Logo;
