"use client"
import { useToast } from "@/components/Toast/ToastContext"
import { apiHttpClient } from "@/lib/httpClient"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { FaSignOutAlt, FaUser } from "react-icons/fa"
import { FaGear } from "react-icons/fa6"

interface IUpperBarMenuProps {
  user: {
    id: string
    name: string
    login: string
  }
}

export default function UpperBarMenu({ user }: IUpperBarMenuProps) {
  const [dropdownProfileOpen, setDropdownProfileOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const router = useRouter()

  const { showToast } = useToast()

  const handleDropdownProfileOpen = () => {
    setDropdownProfileOpen(!dropdownProfileOpen)
  }

  useEffect(() => {
    if (!dropdownProfileOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [dropdownProfileOpen])

  const handleLogout = () => {
    apiHttpClient.post('/auth/logout', {
      credentials: "include",
    })
      .then(() => {
        showToast({
          message: "Logout successful",
          type: "success",
        })
        router.push('/auth/login')
      })
      .catch((error) => {
        showToast({
          message: error.message,
          type: "error",
        })
      })
  }

  return (
    <div className="flex flex-row justify-between items-center bg-white border-b border-gray-300 relative">
      <div></div>
      <button
        ref={buttonRef}
        onClick={handleDropdownProfileOpen}
        className="flex flex-row justify-between items-center gap-2 px-4 py-2 cursor-pointer"
      >
        <h2 className="text-lg font-bold">{user.name}</h2>
        <img src="https://placehold.co/32x32" alt="Avatar" width={32} height={32} className="rounded-full" />
      </button>
      {dropdownProfileOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-13 right-0 w-48 bg-white border border-gray-300 rounded-md z-10"
        >
          <button className="flex flex-row justify-between items-center gap-2 px-4 py-2 cursor-pointer">
            <h2 className="text-lg font-bold flex flex-row items-center gap-2"><FaUser /> Profile</h2>
          </button>
          <button className="flex flex-row justify-between items-center gap-2 px-4 py-2 cursor-pointer">
            <h2 className="text-lg font-bold flex flex-row items-center gap-2"><FaGear /> Settings</h2>
          </button>
          <button onClick={handleLogout} className="flex flex-row justify-between items-center gap-2 px-4 py-2 cursor-pointer">
            <h2 className="text-lg font-bold flex flex-row items-center gap-2"><FaSignOutAlt /> Logout</h2>
          </button>
        </div>
      )}
    </div>
  )
}