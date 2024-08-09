import React from 'react'
import './MainHeader.css'
import MainMenu, { IMainMenuItem } from './MainMenu'

const MainHeader: React.FC = () => {
  const menuItens: IMainMenuItem[] = [
    {
      label: 'Sobre Nós',
      to: '/#about',
    },
    {
      label: 'Time',
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
      </div>
    </div>
  )
}

export default MainHeader
