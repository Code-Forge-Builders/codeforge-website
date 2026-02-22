'use client'
import Image from "next/image";
import Button from "../../_components/Button";
import Input from "../../_components/Input";
import { FormEvent, useEffect, useState } from "react";
import checkInitialSetup from "../../services/check-initial-setup";
import { redirect } from "next/navigation";

export default function Login() {
  const [initialSetup, setInitialSetup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  if (!initialSetup) {
    return <div>First access, redirecting to initial setup...</div>
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
  }
  
  return <div className="flex flex-col w-full max-w-sm bg-zinc-100 p-6 rounded-md border border-zinc-300 mx-4">
    <form className="flex flex-col column gap-2" onSubmit={handleSubmit}>
      <Image width={300} height={63} src="/assets/banner-logo-light-300x63.webp" alt="Codeforge's logo" className="w-[300px] h-auto mb-4" />
      <Input
        id="login-input"
        label="Login"
        name="login"
        type="email"
        placeholder="user@email.com"
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        name="password"
        placeholder="P4ssw0rd"
      />
      <Button type="submit" className="mt-8" loading={isLoading}>Login</Button>
    </form>
  </div>
}