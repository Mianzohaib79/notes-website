import { Col, Row, Typography } from 'antd'
import React from 'react'

const { Title } = Typography
const Nopage = () => {
    return (
        <div className=' py-5'>
            <div className="container">
                <Row>
                    <Col span={24}>
                        <Title levle={1} className='text-center'>4044 Page Not Found</Title>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Nopage