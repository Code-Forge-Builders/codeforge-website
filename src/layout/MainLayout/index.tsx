import React, { PropsWithChildren } from 'react'
import MainHeader from '../../components/MainHeader'
import Footer from '../../components/Footer'
import './MainLayout.css'

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <MainHeader />
      <div className="page-container">{children}</div>
      <Footer />
    </>
  )
}

export default MainLayout
