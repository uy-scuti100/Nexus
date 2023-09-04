"use client";

import { Button } from "@/components/ui/button";
import { AiOutlineGithub } from "react-icons/ai";
import { PiGoogleLogo, PiTwitterLogo } from "react-icons/pi";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import supabase from "@/app/api/supabaseClient";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import Link from "next/link";

type SignupFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
   email: z.string().email(),
});

interface OAuthProvider {
   type: "github" | "google" | "twitter";
}

export function CreateAccountComponent() {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const router = useRouter();

   const handleMagicLink = async (data: SignupFormValues) => {
      if (isSubmitting) {
         return;
      }
      setIsSubmitting(true);
      const { email } = data;
      try {
         const { data, error } = await supabase.auth.signInWithOtp({
            email,
         });

         if (error) {
            console.error("Error signing up", error.message);
            toast.error("Error signing up !");
         } else {
            toast.success("Signed up successfully !");
            router.push("/");
         }
      } catch (error: any) {
         console.error("Error signing up:", error.message);
         toast.error("Error signing up !");
         // Handle unexpected errors here
      } finally {
         setTimeout(() => {
            setIsSubmitting(false);
         }, 6000);
      }
   };

   const handleSignUpWithProvider = async (provider: OAuthProvider) => {
      try {
         const { data: user, error } = await supabase.auth.signInWithOAuth({
            provider: provider.type,
         });

         if (user) {
            router.push("/");
            toast.success("Sign up Success !!!");
         } else if (error) {
            console.log(error.message);
         }
      } catch (error: any) {
         console.log("Error:", error.message);
         toast.error("Error signing up:", error.message);
      } finally {
         setTimeout(() => {
            setIsSubmitting(false);
         }, 6000);
      }
   };

   const form = useForm<SignupFormValues>({
      resolver: zodResolver(formSchema),
   });
   return (
      <Card className="w-[350px]  md:w-auto ">
         <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
               Create your free account
            </CardTitle>
            <CardDescription className="text-center">
               Enter your details below to create your account
            </CardDescription>
         </CardHeader>
         <CardContent className="grid gap-4">
            <Form {...form}>
               <form
                  className="grid gap-4 w-[350px] md:w-auto "
                  onSubmit={form.handleSubmit(handleMagicLink)}>
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem className="grid gap-2">
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={isSubmitting}
                                 placeholder="abc@gmail.com"
                                 {...field}
                                 className="w-[300px] md:w-full "
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     variant="default"
                     className="w-[300px] md:w-full"
                     type="submit"
                     disabled={isSubmitting}>
                     {isSubmitting ? "Creating account" : "Create account"}
                  </Button>
               </form>
            </Form>
            <div className="relative w-[300px] md:w-full ">
               <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-background text-muted-foreground">
                     Or continue with
                  </span>
               </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 w-[300px] md:w-full ">
               <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSignUpWithProvider({ type: "github" })}>
                  <AiOutlineGithub className="w-4 h-4 mr-2 dark:text-white" />
                  Github
               </Button>
               <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSignUpWithProvider({ type: "google" })}>
                  <PiGoogleLogo className="w-4 h-4 mr-2 dark:text-white" />
                  Google
               </Button>
               <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSignUpWithProvider({ type: "twitter" })}>
                  <PiTwitterLogo className="w-4 h-4 mr-2 dark:text-white" />
                  twitter
               </Button>
            </div>
         </CardContent>
         <CardFooter>
            <CardContent>
               <p className="text-center">
                  already have an account ?{" "}
                  <span className="text-blue-900 underline">
                     <Link href="/login">log in</Link>
                  </span>
               </p>
            </CardContent>
         </CardFooter>
      </Card>
   );
}
