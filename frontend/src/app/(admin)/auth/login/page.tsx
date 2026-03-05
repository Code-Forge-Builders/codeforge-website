'use client'
import Image from "next/image";
import Button from "../../_components/Button";
import Input from "../../_components/Input";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import checkInitialSetup from "../../services/checkInitialSetup";
import { redirect } from "next/navigation";
import handleLogin, { ILoginPayload } from "./handleLogin";
import { useToast } from "@/components/Toast/ToastContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [initialSetup, setInitialSetup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter()

  const { showToast } = useToast()

  const loginInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function updateInitialSetup() {
      const iniSetup = await checkInitialSetup();

      setInitialSetup(iniSetup);

      if(!iniSetup) {
        setTimeout(() => {
          redirect('initial-setup')
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
      !loginInputRef.current ||
      !passwordInputRef.current
    ) {
      setIsLoading(false)
      return
    }
    
    const login = loginInputRef.current.value
    const password = passwordInputRef.current.value

    const payload: ILoginPayload = {
      login,
      password
    }
    
    handleLogin(payload)
      .then(() => {
        // Redirect to the dashboard
        router.push('/admin/dashboard')
      })
      .catch((error) => {
        // Alert the error
        showToast({
          message: error.message,
          type: "error",
        })
      })
      .finally(() => setIsLoading(false))
  }, [setIsLoading, showToast])

  if (!initialSetup) {
    return <div>First access, redirecting to initial setup...</div>
  }
  
  return <div className="flex flex-col w-full max-w-sm bg-zinc-100 p-6 rounded-md border border-zinc-300 mx-4">
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Image width={300} height={63} src="/assets/banner-logo-light-300x63.webp" alt="Codeforge's logo" className="w-[300px] h-auto mb-4" />
      <Input
        ref={loginInputRef}
        id="login-input"
        label="Login"
        name="login"
        type="email"
        placeholder="user@email.com"
        required
      />
      <Input
        ref={passwordInputRef}
        id="login-password"
        label="Password"
        type="password"
        name="password"
        placeholder="P4ssw0rd"
        required
      />
      <Button type="submit" className="mt-8" loading={isLoading}>Login</Button>
    </form>
  </div>
}