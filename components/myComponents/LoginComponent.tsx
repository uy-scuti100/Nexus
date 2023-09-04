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
// import * as bcrypt from "bcrypt";
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
import {
   signInWithEmailPassword,
   signInWithEmailPasswordSuccess,
   signInWithEmailPasswordFailed,
   signInWithGoogle,
   signInWithGoogleSuccess,
   signInWithGoogleFailed,
   signInWithGithub,
   signInWithGithubFailed,
   signInWithGithubSuccess,
   signInWithTwitter,
   signInWithTwitterFailed,
   signInWithTwitterSuccess,
   logOut,
} from "../../state/authSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

type SignupFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
   email: z.string().email(),
   password: z.string().min(5),
});

export function LoginComponent() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const dispatch = useDispatch();

   const router = useRouter();

   const handleLogin = async (data: SignupFormValues) => {
      if (isSubmitting) {
         return;
      }

      setIsSubmitting(true);
      const { email, password } = data;
      try {
         let { data: user, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });
         if (error) {
            console.error("Error logging in", error.message);
            toast.error("Error logging in !");
            dispatch(signInWithEmailPasswordFailed);
         } else if (user) {
            dispatch(
               signInWithEmailPasswordSuccess({
                  id: user.user?.id,
                  email: user.user?.email,
               })
            );
            // console.log(user);
            toast.success("Signed up successfully !");
            router.push("/posts");
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

   //   finally {
   //          // toast.success("Signed up successfully !");
   //          setTimeout(() => {
   //             setIsSubmitting(false);
   //          }, 6000);
   //       }
   //    };

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
                  onSubmit={form.handleSubmit(handleLogin)}>
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

                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem className="grid gap-2">
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={isSubmitting}
                                 type="password"
                                 placeholder="******"
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
                     {isSubmitting ? "Logging in" : "Log In"}
                  </Button>
               </form>
            </Form>
         </CardContent>
         <CardFooter>
            <CardContent>
               <p className="text-center">
                  are you a new member ?{" "}
                  <span className="text-blue-900 underline">
                     <Link href="/">register here</Link>
                  </span>
               </p>
            </CardContent>
         </CardFooter>
      </Card>
   );
}
