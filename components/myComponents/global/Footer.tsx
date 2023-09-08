import React from "react";

const Footer = () => {
   return (
      <footer className="py-5 text-white bg-black dark:bg-white h-80 dark:text-black">
         <div className="max-w-[1192px] px-6 mx-auto">
            <div className="py-6 text-5xl logo ">Nexus</div>
            <div>
               <ul className="flex items-center gap-6 text-sm ">
                  <li>About</li>
                  <li>Help</li>
                  <li>Terms</li>
                  <li>Privacy</li>
               </ul>
            </div>
            <div className="w-full mt-5 border-b border-white"></div>
         </div>
      </footer>
   );
};

export default Footer;
