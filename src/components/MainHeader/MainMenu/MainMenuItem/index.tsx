import { NavLink } from 'react-router-dom'
import './MainMenuItem.css'

interface MainMenuItemProps {
  label: string
  to: string
}

const MainMenuItem: React.FC<MainMenuItemProps> = ({ to, label }) => {
  return (
    <li className="menu-item">
      <NavLink to={to}>{label}</NavLink>
    </li>
  )
}

export default MainMenuItem
