'use client'
import { redirect } from "next/navigation"
import checkInitialSetup from "../../services/check-initial-setup"
import { useEffect, useState } from "react"
import Image from "next/image"
import Input from "../../_components/Input"
import Button from "../../_components/Button"

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

  return <div className="flex flex-col w-full max-w-sm bg-zinc-100 p-6 rounded-md border border-zinc-300 mx-4">
      <form className="flex flex-col gap-2">
        <Image width={300} height={63} src="/assets/banner-logo-light-300x63.webp" alt="Codeforge's logo" className="w-[300px] h-auto mb-4" />
        <Input id="register-name" label="Name" name="name" placeholder="John Doe"/>
        <Input
          id="register-login"
          label="Login"
          name="login"
          type="email"
          placeholder="user@email.com"
        />
        <Input
          id="register-password"
          label="Password"
          type="password"
          name="password"
          placeholder="P4ssw0rd"
        />
        <Input
          id="register-confirm-password"
          label="Confirm password"
          type="password"
          name="confirm-password"
          placeholder="P4ssw0rd"
        />
        <Button type="submit" className="mt-8">Register initial user</Button>
      </form>
  </div>
}