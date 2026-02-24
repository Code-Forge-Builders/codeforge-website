import "../../globals.css"
import { Open_Sans, Source_Code_Pro } from "next/font/google";

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
    <body className={`${openSans.variable} ${sourceCodePro.variable} bg-zinc-200 text-foreground-light w-full h-full flex justify-center items-center antialiased `}>{children}</body>
  </html>
}