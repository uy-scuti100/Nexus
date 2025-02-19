import React from "react";
import Image from "next/image";
import Twitter from "../../../public/social_twitter.png";
import Facebook from "../../../public/social_facebook.png";
import Instagram from "../../../public/social_instagram.png";
import Google from "../../../public/social_google.png";
import Discord from "../../../public/social_discord.png";

type Props = {
   isDark?: boolean;
};

const SocialLinks = ({ isDark = false }: Props) => {
   return (
      <div className="flex items-center justify-between gap-7">
         <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <Image
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="twitter"
               src={Twitter}
               width={20}
               height={20}
            />
         </a>
         <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <Image
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="facebook"
               src={Facebook}
               width={20}
               height={20}
            />
         </a>
         <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Image
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="instagram"
               src={Instagram}
               width={20}
               height={20}
            />
         </a>
         <a href="https://google.com" target="_blank" rel="noreferrer">
            <Image
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="google"
               src={Google}
               width={20}
               height={20}
            />
         </a>
         <a href="https://discord.com" target="_blank" rel="noreferrer">
            <Image
               className={`${isDark ? "brightness-0" : ""} hover:opacity-50`}
               alt="discord"
               src={Discord}
               width={20}
               height={20}
            />
         </a>
      </div>
   );
};

export default SocialLinks;
