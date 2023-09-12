import Image from "next/image";
import React from "react";
import loading from "../../public/Fast loading.gif";

function Loading() {
   return (
      <div className="fixed inset-0 flex items-center justify-center bg-white ">
         <div className="relative w-[300px] md:w-[500px] h-auto">
            <Image src={loading} fill alt="loading-image" />
         </div>
      </div>
   );
}

export default Loading;
