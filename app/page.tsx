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
   // const [image, setImage] = useState("");
   // const [image, setImage] = useState("");
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
               console.log(user);

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
            // Dispatch the logOut action to clear the user data in the Redux store
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
      <main className="pt-[200px] ">
         <h1>Welcome!</h1>
         <Image src={image} alt="user-image" width={200} height={200} />
         <p>
            Thank you for creating an account {name}. Please check your inbox at{" "}
            {email} and click the link we sent to complete your account set-up.
         </p>
         <Button>Click here to resend the email</Button>
         <Button variant="destructive" onClick={logOff}>
            logout
         </Button>
         current user: {currentUser?.email}
         current user: {currentUser?.id}
      </main>
   );
};

export default WelcomePage;
