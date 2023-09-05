"use client";

import OnboardNav from "@/components/myComponents/OnboardNav";
import PopUpProvider from "@/components/myComponents/PopUpProvider";
import { ModalContext, ModalContextProp } from "@/state/context/modalContext";
import { useContext } from "react";
import svg from "../../public/onboard.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { CreateAccountComponent } from "@/components/myComponents/CreateAccountComponent";
import OnBoardTrendingPost from "@/components/myComponents/OnBoardTrendingPost";

export default function Page() {
   const { openModal, openJoinModal, toggleJoinFormModal } = useContext(
      ModalContext
   ) as ModalContextProp;
   return (
      <main className="relative">
         {openModal && (
            <PopUpProvider>
               <CreateAccountComponent title=" Welcome back." type="log in" />
            </PopUpProvider>
         )}
         {openJoinModal && (
            <PopUpProvider>
               <CreateAccountComponent title=" Join Nexus" type="sign up" />
            </PopUpProvider>
         )}
         <OnboardNav />
         <div className="y-8 pt-[63px]">
            <div className="bg-[#51b045] text-white px-6 pt-5">
               <div className="md:flex block items-center md:max-w-[1192px] justify-between mx-auto pt-10">
                  <div className="flex-1">
                     <div className="">
                        <h1 className=" tracking-wide md:text-[70px] text-[50px] font-[miracle] font-bold text-center md:text-left">
                           Fuel Your Curio
                           <span className="text-black">sity.</span>
                        </h1>

                        <h3 className="pt-6 text-base font-medium text-white/80 md:text-lg ">
                           Unlock a treasure trove of wisdom, explore
                           captivating narratives, and delve into the minds of
                           experts from various domains right here. We're here
                           to satiate your thirst for knowledge and ignite your
                           curiosity.
                        </h3>
                     </div>
                     <div className="pt-10 text-center md:text-left">
                        <Button
                           className="w-fit bg-black p-6 font-bold tracking-wider rounded-3xl text-xl "
                           onClick={toggleJoinFormModal}>
                           Start writing
                           <span className="w-4 h-4 ml-2">
                              <Send />
                           </span>
                        </Button>
                     </div>
                  </div>
                  <div className="flex-1">
                     <Image
                        src={svg}
                        height={500}
                        width={600}
                        alt="svg"
                        className="h-[500px] "
                     />
                  </div>
               </div>
            </div>

            <p className="pt-20 px-6 text-lg md:text-3xl font-medium text-center mx-auto">
               Welcome aboard, fellow traveler. Let's embark on this exciting
               journey together and see where the Nexus takes us.
            </p>
         </div>

         <OnBoardTrendingPost />
      </main>
   );
}
