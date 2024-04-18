import React from 'react'
import { Layout, Typography } from 'antd'
const { Text } = Typography
const { Footer } = Layout;

const Foot = () => {
  return (
    <Footer className='footerStyle' >
        <Text type="secondary">ConciergeStay ©{new Date().getFullYear()}</Text>
    </Footer>
  )
}

export default Foot