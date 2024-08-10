import { NavLink } from 'react-router-dom'
import './MainMenuItem.css'
import { HTMLProps } from 'react'

interface MainMenuItemProps extends HTMLProps<HTMLElement> {
  label: string
  to: string
}

const MainMenuItem: React.FC<MainMenuItemProps> = ({ to, label, onClick }) => {
  return (
    <li className="menu-item" onClick={onClick}>
      <NavLink to={to}>{label}</NavLink>
    </li>
  )
}

export default MainMenuItem
