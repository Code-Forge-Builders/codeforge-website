import { AiFillDashboard } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import MenuItem, { IMenuItem } from "./MenuItem";
import Image from "next/image";

const MENU_TREE: IMenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: <AiFillDashboard />
  },
  {
    title: 'Leads',
    url: '/admin/leads',
    icon: <FaUsers />
  },
]

export default function SideMenu() {
  return (
    <div className="fixed flex flex-col items-center min-w-90 h-screen bg-side-menu-bg text-white">
      <Image width={250} height={52} src="/assets/banner-logo-dark-300x63.webp" alt="Codeforge's logo" className="w-[250px] h-auto my-4" />
      <ul style={{ listStyle: 'none', scrollbarWidth: 'thin' }} className="flex flex-col gap-2 w-full overflow-y-auto">
        {MENU_TREE.map((item, index) => (
          <MenuItem key={index} item={item} />
        ))}
      </ul>
    </div>
  )
}