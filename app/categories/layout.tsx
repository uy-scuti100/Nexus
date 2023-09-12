import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <main>
         <Navbar />
         <Category />
         {children}
      </main>
   );
}
