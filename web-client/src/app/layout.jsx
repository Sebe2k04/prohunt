import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Toast from "@/components/Toast";
import { AuthProvider } from "@/context/AuthProvider";
import NavbarHandler from "@/components/NavbarHandler";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pro Hunt",
  description:
    "Project hunt is a open source collaborative platform to build teams and it fosters a community-driven approach, where contributors can improve software or content, offer feedback, and showcase their skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={` ${inter} vsc-initialized antialiased inter `}>
        <ThemeProvider>
          <AuthProvider>
          <div className="dark:bg-[#121212] min-h-[100vh] dark:text-gray-400 text-gray-700  ">
            <NavbarHandler />
            {children}
          </div>
          <Toast />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
