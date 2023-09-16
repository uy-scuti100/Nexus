"use client";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast/toast-provider";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import ModalContextProvider from "@/state/context/modalContext";
import Footer from "@/components/myComponents/global/Footer";
import Write from "@/components/myComponents/global/Write";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "Nexus",
   description: "Fuel your curiosity by getting answers here",
};
// export const metadata = {
//    title: "Blog AI App",
//    description: "Blog built in Next JS that uses AI",
//  };

export default function RootLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <html lang="en">
         <Provider store={store}>
            <body className={`{inter.className} relative`}>
               <ModalContextProvider>
                  <ToastProvider />
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem>
                     {children}
                     <Footer />
                     {/* <Write /> */}
                  </ThemeProvider>
               </ModalContextProvider>
            </body>
         </Provider>
      </html>
   );
}
