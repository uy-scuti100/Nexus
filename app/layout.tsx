import { ThemeProvider } from "@/components/providers/theme/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/providers/toast/toast-provider";
import ModalContextProvider from "@/state/context/modalContext";
import Footer from "@/components/myComponents/global/Footer";
import Write from "@/components/myComponents/global/Write";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
         {/* <Provider store={store}> */}
         <body className={`${inter.className} relative`}>
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
         {/* </Provider> */}
      </html>
   );
}
