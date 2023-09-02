"use client";

import { Button } from "@/components/ui/button";
import { AiOutlineGithub } from "react-icons/ai";
import { PiGoogleLogo } from "react-icons/pi";
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

type SignupFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
   username: z.string().min(2),
   email: z.string().email(),
   password: z.string().min(5),
});

interface OAuthProvider {
   type: "github" | "google";
}

export function CreateAccountComponent() {
   const [isSubmitting, setIsSubmitting] = useState(false);

   const router = useRouter();

   const handleSignupWithEmailAndPassword = async (data: SignupFormValues) => {
      if (isSubmitting) {
         return;
      }

      setIsSubmitting(true);
      const { username, email, password } = data;
      try {
         const { data: user, error } = await supabase.auth.signUp({
            email,
            password,
         });
         if (error) {
            console.error("Error signing up", error.message);
            toast.error("Error signing up !");
         } else if (user) {
            const { error: profileError } = await supabase
               .from("users")
               .upsert([
                  {
                     username,
                     email,
                     password,
                     id: user.user?.id,
                  },
               ])
               .select();

            if (profileError) {
               console.error(
                  "Error updating user profile:",
                  profileError.message
               );
               toast.error("Error updating user profile !");
               // Handle the profile update error
            } else {
               console.log("User signed up successfully:", user);
               toast.success("User signed up successfully !");
               router.push("/posts");
            }
         }
      } catch (error: any) {
         console.error("Error signing up:", error.message);
         // Handle unexpected errors here
      } finally {
         setTimeout(() => {
            setIsSubmitting(false);
         }, 6000);
      }
   };

   const handleSignUpWithprovider = async (provider: OAuthProvider) => {
      try {
         const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "github",
         });
         if (!error) {
            console.log(data);
            toast.success("Signed up successfully !");
            // router.push("/posts");
         } else {
            console.error("Error signing in:", error.message);
         }
      } catch (error: any) {
         console.error("Error:", error.message);
         toast.error("Error signing up:", error.message);
      } finally {
         console.log();
         setTimeout(() => {
            setIsSubmitting(false);
         }, 6000);
      }
   };

   const form = useForm<SignupFormValues>({
      resolver: zodResolver(formSchema),
   });
   return (
      <Card>
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
                  className="grid gap-4"
                  onSubmit={form.handleSubmit(
                     handleSignupWithEmailAndPassword
                  )}>
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field }) => (
                        <FormItem className="grid gap-2">
                           <FormLabel>Title</FormLabel>
                           <FormControl>
                              <Input
                                 disabled={isSubmitting}
                                 placeholder="John Doe"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

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
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button
                     variant="default"
                     className="w-full"
                     type="submit"
                     disabled={isSubmitting}>
                     {isSubmitting ? "Creating account" : "Create account"}
                  </Button>
               </form>
            </Form>
            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-background text-muted-foreground">
                     Or continue with
                  </span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSignUpWithprovider({ type: "github" })}>
                  <AiOutlineGithub className="w-4 h-4 mr-2 dark:text-white" />
                  Github
               </Button>
               <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleSignUpWithprovider({ type: "google" })}>
                  <PiGoogleLogo className="w-4 h-4 mr-2 dark:text-white" />
                  Google
               </Button>
            </div>
         </CardContent>
         <CardFooter>
            <CardContent>
               <p className="text-center">
                  already have an account ?{" "}
                  <span className="text-sm text-blue-900 underline">
                     log in
                  </span>
               </p>
            </CardContent>
         </CardFooter>
      </Card>
   );
}
