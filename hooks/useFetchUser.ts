"use client";
import useSWR from "swr";
import { fetchSingleUser } from "../lib/fetchUserUtil";
import { User } from "@/types";

export const useFetchUser = (): {
   user: User | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: user, error } = useSWR("currentUser", fetchSingleUser, {
      refreshInterval: 60000,
   });

   return {
      user,
      isLoading: !user && !error,
      isError: error,
   };
};
