'use client'
import { redirect } from "next/navigation"
import checkInitialSetup from "../../services/check-initial-setup"
import { useEffect, useState } from "react"

export default function InitialSetup() {
  const [initialSetup, setInitialSetup] = useState(true)

  useEffect(() => {
    async function updateInitialSetup() {
      const iniSetup = await checkInitialSetup()

      setInitialSetup(iniSetup)

      if (iniSetup) {
        setTimeout(() => {
          redirect('login')
        }, 3000)
      }
    }

    updateInitialSetup()
  }, [])

  if (initialSetup) {
    return <div>There is already an admin user, redirecting...</div>
  }

  return <div>Register</div>
}