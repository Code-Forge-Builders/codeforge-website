import { Button } from 'react-bootstrap'
import MainMenuItem from '../MainMenu/MainMenuItem'
import { GiHamburgerMenu } from 'react-icons/gi'
import './ResponsiveMenu.css'
import { useState } from 'react'
import { FiX } from 'react-icons/fi'

export interface IMainMenuItem {
  label: string
  to: string
}

interface MainMenuProps {
  itens: IMainMenuItem[]
}

const ResponsiveMenu: React.FC<MainMenuProps> = ({ itens }) => {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <nav className="responsive-menu-nav flex-column" aria-expanded={isActive}>
        <Button aria-label="Abrir menu" onClick={() => setIsActive(true)}>
          <GiHamburgerMenu size={40} />
        </Button>
        <div className="responsive-menu-container">
          <nav className="responsive-menu">
            <div className="d-flex justify-content-end">
              <Button
                aria-label="Fechar menu"
                onClick={() => setIsActive(false)}
              >
                <FiX />
              </Button>
            </div>
            <ul className="d-flex flex-column" style={{ minWidth: '12rem' }}>
              {itens.map((item, idx) => (
                <MainMenuItem
                  key={idx}
                  to={item.to}
                  label={item.label}
                  onClick={() => setIsActive(false)}
                />
              ))}
            </ul>
          </nav>
        </div>
      </nav>
    </>
  )
}

export default ResponsiveMenu
