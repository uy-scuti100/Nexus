import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { ModeToggle } from "@/components/providers/theme/theme-toggle";
import { User } from "@/types";
import { useUser } from "@/lib/useUser";
import avatar from "../../../public/png.png";
import { Bell, Search } from "lucide-react";

const Navbar = () => {
   const { user } = useUser();

   return (
      <nav className="fixed flex items-center self-center justify-between w-full px-6 py-6 pt-6 mx-auto bg-white dark:bg-background">
         <div className="text-3xl md:text-4xl logo">Nexus</div>
         <div className="flex items-center gap-7">
            <Search />
            <div className="relative">
               <div className="absolute px-2 rounded-[50%] left-3 -top-4 bg-eccentric text-white">
                  1
               </div>
               <Bell />
            </div>

            <div>
               <Image
                  src={user ? (user?.avatarUrl as string) : avatar}
                  width={40}
                  height={40}
                  alt="user-profile-img"
                  className="rounded-full border border-accent w-[40px] h-[40px]  hover:scale-110 transition duration-300 "
               />
            </div>
         </div>
      </nav>
   );
};

export default Navbar;
