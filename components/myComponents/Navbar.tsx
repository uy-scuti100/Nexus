"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import avatar from "../../public/avatar.jpg";
import darklogo from "../../public/download (3).png";
import lightlogo from "../../public/download (2).png";
import { useTheme } from "next-themes";
import { ModeToggle } from "../providers/theme/theme-toggle";

const Navbar = () => {
   const { setTheme, resolvedTheme } = useTheme();
   const [logosrc, setLogoSrc] = useState(
      resolvedTheme === "dark" ? darklogo : lightlogo
   ); // Default to the light logo

   useEffect(() => {
      const handleThemeChange = () => {
         if (resolvedTheme === "dark") {
            setLogoSrc(darklogo);
         } else {
            setLogoSrc(lightlogo);
         }
      };

      handleThemeChange();
   }, [resolvedTheme]);

   const user = false;
   return (
      <nav className="fixed flex items-center self-center justify-between w-full px-6 py-6 pt-6 mx-auto">
         <div className="text-2xl md:text-5xl logo ">
            {" "}
            <Image
               src={logosrc}
               width={150}
               height={100}
               alt="user-profile-img"
               className="object-cover transition duration-300 hover:scale-110"
            />
         </div>
         <div className="flex items-center gap-4">
            <ModeToggle />
            {user && (
               <div>
                  <Image
                     src={avatar}
                     width={40}
                     height={40}
                     alt="user-profile-img"
                     className="rounded-full border border-accent w-[40px] h-[40px] object-cover hover:scale-110 transition duration-300"
                  />
               </div>
            )}
         </div>
      </nav>
   );
};

export default Navbar;
