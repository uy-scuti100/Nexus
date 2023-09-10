"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUser } from "@/hooks/useUser";
import OnBoard from "@/components/myComponents/global/OnBoard";
import { signInSuccess } from "@/state/authSlice";

const Page = () => {
   const { user, isLoading, isError } = useUser();

   const dispatch = useDispatch();

   useEffect(() => {
      if (user) {
         dispatch(signInSuccess(user));
      }
   }, [user, dispatch]);

   if (isLoading) {
      return <OnBoard />;
   }

   if (isError) {
      return <main>Error loading user data</main>;
   }

   if (!user) {
      return <OnBoard />;
   }
   if (user) {
      window.location.href = "/posts";
   }

   return null;
};

export default Page;
