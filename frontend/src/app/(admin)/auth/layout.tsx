import { ToastProvider } from "@/components/Toast/ToastContext";
import "../../globals.css"
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import { ToastContainer } from "@/components/Toast/ToastContainer";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
})

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className="w-full h-full">
    <head>
      <title>Codeforge - Admin Login</title>
    </head>
    <body className={`${openSans.variable} ${sourceCodePro.variable} bg-zinc-200 text-foreground-light w-full h-full flex justify-center items-center antialiased `}>
      <ToastProvider>
        {children}
        <ToastContainer/>
      </ToastProvider>
    </body>
  </html>
}