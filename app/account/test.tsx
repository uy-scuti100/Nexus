import React, { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/useUser";

const Account = () => {
   const { user, isLoading, isError } = useUser(); // Move this hook call outside of useEffect

   const [name, setName] = useState<string | null | undefined>("");
   const [email, setEmail] = useState<string | null | undefined>("");
   const [loggingOut, setLoggingOut] = useState(false);

   useEffect(() => {
      if (user) {
         const name = user?.fullName;
         const email = user?.email;

         setName(name);
         setEmail(email);
      }
   }, [user]); // Include user as a dependency

   const logOff = async () => {
      setLoggingOut(true);
      try {
         const { error } = await supabase.auth.signOut();

         if (error) {
            console.error("Error signing out:", error);
         } else {
            window.location.href = "/";
         }
      } catch (error) {
         console.error("Error signing out:", error);
      }
   };

   return (
      <main className="pt-44">
         Your account {email} has an id {name}
         <div className="pt-20">
            <Button onClick={logOff} disabled={loggingOut}>
               Log Out
            </Button>
         </div>
      </main>
   );
};

export default Account;
