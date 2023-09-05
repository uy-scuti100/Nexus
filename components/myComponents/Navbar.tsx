"use client";
import Image from "next/image";
import { useContext } from "react";
import avatar from "../../public/avatar.jpg";
import { ModeToggle } from "../providers/theme/theme-toggle";
import { ModalContext, ModalContextProp } from "@/state/context/modalContext";

const Navbar = () => {
   const { toggleFormModal } = useContext(ModalContext) as ModalContextProp;

   const user = false;
   return (
      <nav className="fixed flex items-center self-center justify-between w-full px-6 py-6 pt-6 mx-auto bg-white dark:bg-background">
         <div className="text-5xl logo ">Nexus</div>
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
