import { ToastContainer } from "@/components/Toast/ToastContainer";
import { ToastProvider } from "@/components/Toast/ToastContext";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import { authCheck } from "./authCheck";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
})

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await authCheck()


  return <html lang="en">
    <head>
      <title>Codeforge - Admin Dashboard</title>
    </head>
    <body className={`${openSans.variable} ${sourceCodePro.variable} bg-zinc-200 text-foreground-light antialiased `}>
      <ToastProvider>
        {children}
        <ToastContainer/>
      </ToastProvider>
      </body>
  </html>
}