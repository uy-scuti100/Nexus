import useSWR from "swr";
import { fetchUser } from "./authUtils";
import { User } from "@/types";

export const useUser = (): {
   user: User | null | undefined;
   isLoading: boolean;
   isError: boolean;
} => {
   const { data: user, error } = useSWR("user", fetchUser);

   return {
      user,
      isLoading: !user && !error,
      isError: error,
   };
};
