import Image from "next/image";
import React from "react";
import loading from "../../public/Fast loading.gif";

function page() {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-white ">
         <div className="relative w-full md:w-[500px] h-[500px]">
            <Image src={loading} fill alt="loading-image" />
         </div>
      </div>
   );
}

export default page;
