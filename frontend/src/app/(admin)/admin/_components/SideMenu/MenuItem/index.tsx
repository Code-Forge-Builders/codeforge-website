'use client'
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import { FaChevronRight } from "react-icons/fa"
import { FaChevronDown } from "react-icons/fa6"

export interface IMenuItem {
  title: string
  url?: string
  icon: React.ReactNode
  children?: IMenuItem[]
}

export default function MenuItem({ item }: { item: IMenuItem }) {
  const [isActive, setIsActive] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const checkChildrenActiveRecursively = useCallback((children: IMenuItem[]) : boolean => {
    return children.some(child => {
      if (child.url && !child.children) {
        return window.location.pathname === child.url
      }
      return checkChildrenActiveRecursively(child.children || [])
    })
  }, [])

  useEffect(() => {
    if (item.url) {
      setIsActive(window.location.pathname === item.url)
    }
    if (item.children) {
      setIsActive(checkChildrenActiveRecursively(item.children))
    }
  }, [checkChildrenActiveRecursively])

  useEffect(() => {
    if (item.children) {
      setIsOpen(isActive)
    }
  }, [isActive])

  if (item.children) {
    return (
      <li className="flex flex-col gap-2">
        <button onClick={() => setIsOpen(!isOpen)} className={`${isActive ? 'bg-side-menu-active' : ''} flex items-center gap-2 cursor-pointer hover:bg-side-menu-hover p-2 rounded-sm`}>
          <div className="flex-1 flex items-center gap-2">
            {item.icon}
            {item.title}
          </div>
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </button>
        {isOpen && (
          <ul style={{ listStyle: 'none' }} className="flex flex-col gap-2 pl-2">
            {item.children.map((child, index) => (
              <MenuItem key={index} item={child} />
            ))}
          </ul>
        )}
      </li>
    )
  }
  
  return (
    <li className="flex flex-col gap-2">
      <Link className={`${isActive ? 'bg-side-menu-active' : ''} flex items-center gap-2 hover:bg-side-menu-hover p-2 rounded-sm`} href={item.url || ''}>
        {item.icon}
        {item.title}
      </Link>
    </li>
  )
}