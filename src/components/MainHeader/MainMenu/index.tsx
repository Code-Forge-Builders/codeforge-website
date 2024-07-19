import MainMenuItem from "./MainMenuItem"

export interface IMainMenuItem {
    label: string
    to: string
}

interface MainMenuProps {
    itens: IMainMenuItem[]
}

const MainMenu: React.FC<MainMenuProps> = ({itens}) => {
    return (
        <ul className="main-menu">
            {itens.map((item, idx) => (
                <MainMenuItem key={idx} to={item.to} label={item.label}/>
            ))}
        </ul>
    )
}

export default MainMenu