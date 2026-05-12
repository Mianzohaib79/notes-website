import React from 'react';
import { Space } from 'antd';

const Logo = ({ size = 'normal' }) => {
    // scale styles based on size
    const fontSize = size === 'large' ? '2.5rem' : '1.5rem';

    return (
        <span className="brand-logo" style={{ fontSize }}>
            <Space align="center" size="small">
                <span className="logo-icon" style={{ display: 'inline-block', animation: 'float 3s ease-in-out infinite' }}>📓</span>
                <span className="logo-text fw-bold">Notes</span>
            </Space>
        </span>
    );
};

export default Logo;
