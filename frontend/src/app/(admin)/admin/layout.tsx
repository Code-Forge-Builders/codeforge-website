import { ToastContainer } from "@/components/Toast/ToastContainer";
import { ToastProvider } from "@/components/Toast/ToastContext";
import { Open_Sans, Source_Code_Pro } from "next/font/google";
import { authCheck } from "./authCheck";
import SideMenu from "./_components/SideMenu";
import "../../globals.css";
import PageContentContainer from "./_components/PageContentContainer";
import UpperBarMenu from "./dashboard/_components/UpperBarMenu";
import getUser from "./getUser";

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

  const { user } = await getUser()

  return <html lang="en">
    <head>
      <title>Codeforge</title>
    </head>
    <body className={`${openSans.variable} ${sourceCodePro.variable} bg-zinc-200 text-foreground-light antialiased `}>
      <ToastProvider>
        <div className="flex">
          <SideMenu />
          <main className="flex-1 ml-90">
            <UpperBarMenu user={user} />
            <PageContentContainer>
              {children}
            </PageContentContainer>
          </main>
        </div>
        <ToastContainer />
      </ToastProvider>
    </body>
  </html>
}
