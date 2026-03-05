import { ToastContainer } from "@/components/Toast/ToastContainer";
import { ToastProvider } from "@/components/Toast/ToastContext";
import { Open_Sans, Source_Code_Pro } from "next/font/google";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
})

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en">
    <ToastProvider>
      <body className={`${openSans.variable} ${sourceCodePro.variable} bg-zinc-200 text-foreground-light antialiased `}>
        {children}
        <ToastContainer/>
      </body>
    </ToastProvider>
  </html>
}