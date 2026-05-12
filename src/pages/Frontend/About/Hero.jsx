import { Col, Row, Typography } from 'antd'
import React from 'react'

const { Title, Text } = Typography
const Hero = () => {
    return (
        <div className='page-hero d-flex align-items-center fade-in' style={{ minHeight: '60vh', background: 'linear-gradient(180deg, #fff 0%, #f8fafc 100%)' }}>
            <div className="container text-center">
                <Title style={{ fontWeight: 800, fontSize: '3rem', letterSpacing: '-1px', marginBottom: '24px' }}>All Your Notes</Title>
                <Text type="secondary" style={{ fontSize: '18px', maxWidth: '600px', display: 'inline-block' }}>
                    A centralized place for all your thoughts, shared wisdom, and creative ideas. 
                    Organize your life with simplicity and elegance.
                </Text>
            </div>
        </div>

    )
}

export default Hero