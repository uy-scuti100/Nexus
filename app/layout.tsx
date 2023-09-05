"use client";
import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast/toast-provider";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import ModalContextProvider from "@/state/context/modalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
   title: "Nexus",
   description: "Fuel your curiosity by getting answers here",
};

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
                  </ThemeProvider>
               </ModalContextProvider>
            </body>
         </Provider>
      </html>
   );
}
