"use client";
import Image from "next/image";

import avatar from "../../../public/png.png";
import { Bell, ChevronDown, Search } from "lucide-react";
import SideNav from "./SideNav";
import { useState } from "react";
import Link from "next/link";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useRouter } from "next/navigation";
import Write from "./Write";

const Navbar = () => {
   const [sidenav, setSidenav] = useState(false);
   const router = useRouter();
   const { user } = useFetchUser();
   const toggleSideNav = () => {
      setSidenav((prev) => !prev);
   };

   return (
      <nav className="fixed z-50 flex items-center self-center justify-between w-full px-6 py-6 pt-6 mx-auto bg-white border-b border-black/20 dark:bg-background">
         <div
            className="text-3xl cursor-pointer md:text-4xl logo"
            onClick={() => router.push("/home")}>
            Nexus
         </div>

         <div className="flex items-center gap-7">
            <Write />

            <Link href="/search">
               <Search className="cursor-pointer" />
            </Link>

            {user && (
               <div className="relative">
                  <div className="absolute px-1 text-xs font-bold text-white rounded-sm shadow-2xl left-3 -top-3 bg-accent-orange shadow-white">
                     1
                  </div>
                  <Bell className="cursor-pointer" />
               </div>
            )}

            <div className="flex items-center gap-3">
               <Image
                  src={user ? (user?.display_pic as string) : avatar}
                  width={40}
                  height={40}
                  alt="user-profile-img"
                  className="rounded-full border border-accent w-[40px] h-[40px]  hover:scale-110 transition duration-300 cursor-pointer"
                  onClick={toggleSideNav}
               />
               {user && (
                  <ChevronDown
                     className={`${
                        sidenav ? "rotate-180" : "rotate-0"
                     }  transition-transform duration-500 cursor-pointer`}
                     onClick={toggleSideNav}
                  />
               )}
            </div>
         </div>
         <SideNav className={`${sidenav ? "right-0" : "-right-full"}`} />
      </nav>
   );
};

export default Navbar;
