import { Col, Row, Typography } from 'antd'
import Logo from '../Misc/Logo'

const { Paragraph } = Typography

const Copyright = () => {

    const year = new Date().getFullYear()

    return (
        <Row align="middle" justify="space-between" className="pt-2 pb-4">
            <Col xs={24} md={12} className="text-center text-md-start mb-2 mb-md-0">
                <Logo size="normal" />
            </Col>
            <Col xs={24} md={12}>
                <Paragraph className='text-center text-md-end mb-0' style={{ color: 'var(--github-muted)' }}>
                    &copy; {year}. All Rights Reserved.
                </Paragraph>
            </Col>
        </Row>
    )
}

export default Copyright