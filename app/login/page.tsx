import { LoginComponent } from "@/components/myComponents/LoginComponent";

import React from "react";

const page = () => {
   return (
      <main>
         <div className="flex justify-center w-full h-screen">
            <div className="h-screen pt-[110px]">
               <LoginComponent />
            </div>
         </div>
      </main>
   );
};

export default page;
