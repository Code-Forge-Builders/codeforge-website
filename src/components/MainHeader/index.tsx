import React from 'react'
import './MainHeader.css'
import MainMenu, { IMainMenuItem } from './MainMenu'
import ResponsiveMenu from './ResponsiveMenu'

const MainHeader: React.FC = () => {
  const menuItens: IMainMenuItem[] = [
    {
      label: 'Quem Somos',
      to: '/#about',
    },
    {
      label: 'Nosso Time',
      to: '/#team',
    },
    {
      label: 'Projetos',
      to: '/#projects',
    },
    {
      label: 'Fale Conosco',
      to: '/#contact',
    },
  ]

  return (
    <div className="header-container">
      <div className="main-header">
        <a href="" className="logo-link">
          <img className="logo-img" src="assets/logo.svg" alt="logo" />
        </a>
        <MainMenu itens={menuItens} />
        <ResponsiveMenu itens={menuItens} />
      </div>
    </div>
  )
}

export default MainHeader
