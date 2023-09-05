"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/app/api/supabaseClient";
import Image from "next/image";
import { signInWithEmailPasswordSuccess, logOut } from "../state/authSlice";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import { useRouter } from "next/navigation";
import PopUpProvider from "@/components/myComponents/PopUpProvider";
import Navbar from "@/components/myComponents/Navbar";

interface User {
   email?: string;
   id?: string;
}
const WelcomePage = () => {
   const currentUser = useSelector((state: RootState) => state.authSlice.user);
   const [email, setEmail] = useState<string | undefined>("");
   const [user, setUser] = useState<User | null>(null);
   const [image, setImage] = useState("");
   const [name, setName] = useState("");
   const dispatch = useDispatch();
   const router = useRouter();
   useEffect(() => {
      const fetchUser = async () => {
         try {
            const {
               data: { user },
            } = await supabase.auth.getUser();

            if (user) {
               const email = user?.email;
               const image = user?.user_metadata?.avatar_url;
               const name = user?.user_metadata?.name;

               setUser(user);
               setEmail(email);
               setImage(image);
               setName(name);
               // console.log(user);

               dispatch(signInWithEmailPasswordSuccess(user));
            }
         } catch (error) {
            console.error("Error fetching user:", error);
         }
      };
      fetchUser();
   }, []);

   const logOff = async () => {
      try {
         let { error } = await supabase.auth.signOut();

         if (!error) {
            dispatch(logOut());
            router.refresh();
         } else {
            console.error("Error signing out:", error);
         }
      } catch (error) {
         console.error("Error signing out:", error);
      }
   };

   return (
      <main>
         <Navbar />
         <div className="pt-150px">
            {/* <PopUpProvider
               title="Account already exists"
               message="There is an existing user with this email, would you try logging in?"
            /> */}
            <h1>Welcome!</h1>
            <Image src={image} alt="user-image" width={200} height={200} />
            <p>
               Thank you for creating an account {name}. Please check your inbox
               at {email} and click the link we sent to complete your account
               set-up.
            </p>
            <Button>Click here to resend the email</Button>
            <Button variant="destructive" onClick={logOff}>
               logout
            </Button>
            current user: {currentUser?.email}
            current user: {currentUser?.id}
         </div>
      </main>
   );
};

export default WelcomePage;
