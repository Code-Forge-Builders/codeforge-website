import React, { PropsWithChildren, useEffect } from 'react'
import MainHeader from '../../components/MainHeader'
import Footer from '../../components/Footer'
import './MainLayout.css'
import { useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'

const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.replace('#', ''))

      console.log(element)
      if (element) {
        element.scrollIntoView()
      }
    }
  }, [location])
  return (
    <>
      <MainHeader />
      <div className="page-container">{children}</div>
      <Footer />
      <Analytics />
    </>
  )
}

export default MainLayout
