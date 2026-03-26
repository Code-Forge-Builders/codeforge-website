'use client'
import { redirect } from "next/navigation"
import checkInitialSetup from "../../services/checkInitialSetup"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Input from "../../_components/Input"
import Button from "../../_components/Button"
import registerInitialSetup, { IPayloadRegisterInitialSetup } from "./register-initial-setup"
import { useToast } from "@/components/Toast/ToastContext"

export default function InitialSetup() {
  const [initialSetup, setInitialSetup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const loginInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null)

  const { showToast } = useToast()

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

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    // Trigger HTML form validation before proceeding
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      setIsLoading(false);
      return;
    }

    if (
      !nameInputRef.current ||
      !loginInputRef.current ||
      !passwordInputRef.current ||
      !confirmPasswordInputRef.current
    ) {
      setIsLoading(false)
      return
    }

    const name = nameInputRef.current.value
    const login = loginInputRef.current.value
    const password = passwordInputRef.current.value
    const confirmPassword = confirmPasswordInputRef.current.value

    if (password !== confirmPassword) {
      setIsLoading(false)
      return
    }

    const payload: IPayloadRegisterInitialSetup = {
      name,
      login,
      password,
      confirm_password: confirmPassword
    }

    registerInitialSetup(payload)
      .then(() => {
        showToast({
          message: "User registered successfully",
          type: "success",
        })
        setTimeout(() => {
          redirect('login')
        }, 1000)
      })
      .catch((error) => {
        showToast({
          message: error.message,
          type: "error",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [showToast])

  if (initialSetup) {
    return <div>There is already an admin user, redirecting...</div>
  }

  return <div className="flex flex-col w-full max-w-sm bg-zinc-100 p-6 rounded-md border border-zinc-300 mx-4">
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Image width={300} height={63} src="/assets/banner-logo-light-300x63.webp" alt="Codeforge's logo" className="w-[300px] h-auto mb-4" />
      <Input
        ref={nameInputRef}
        id="register-name"
        label="Name"
        name="name"
        placeholder="John Doe"
        required
      />
      <Input
        ref={loginInputRef}
        id="register-login"
        label="Login"
        name="login"
        type="email"
        placeholder="user@email.com"
        required
      />
      <Input
        ref={passwordInputRef}
        id="register-password"
        label="Password"
        type="password"
        name="password"
        placeholder="P4ssw0rd"
        required
      />
      <Input
        ref={confirmPasswordInputRef}
        id="register-confirm-password"
        label="Confirm password"
        type="password"
        name="confirm-password"
        placeholder="P4ssw0rd"
        required
      />
      <Button type="submit" className="mt-8" loading={isLoading}>Register initial user</Button>
    </form>
  </div>
}
