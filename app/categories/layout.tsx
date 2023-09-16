import Category from "@/components/myComponents/global/Category";
import Navbar from "@/components/myComponents/global/Navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <main>
         <Navbar />
         <div className="pt-28">
            <Category />
         </div>
         {children}
      </main>
   );
}
