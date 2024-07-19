import { Link } from "react-router-dom"

interface MainMenuItemProps {
    label: string
    to: string 
}

const MainMenuItem: React.FC<MainMenuItemProps> = ({to, label}) => {
    return (
            <li className="menu-item">
                <Link to={to}>
                    {label}
                </Link>
            </li>
    )
}

export default MainMenuItem