import { CreateAccountComponent } from "@/components/myComponents/CreateAccountComponent";
import React from "react";

const page = () => {
   return (
      <main>
         <div className="flex justify-center w-full h-screen">
            <div className="h-screen pt-[110px]">
               <CreateAccountComponent />
            </div>
         </div>
      </main>
   );
};

export default page;
