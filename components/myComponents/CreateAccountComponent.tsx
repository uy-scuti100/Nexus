// "use client";

// import { Button } from "@/components/ui/button";
// import { AiOutlineGithub, AiOutlineMail } from "react-icons/ai";
// import { PiGoogleLogo, PiTwitterLogo } from "react-icons/pi";
// import {
//    Card,
//    CardContent,
//    CardDescription,
//    CardFooter,
//    CardHeader,
//    CardTitle,
// } from "@/components/ui/card";

// import supabase from "@/app/api/supabaseClient";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { redirect, useRouter } from "next/navigation";
// import * as z from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//    Form,
//    FormControl,
//    FormField,
//    FormItem,
//    FormLabel,
//    FormMessage,
// } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import Link from "next/link";

// type SignupFormValues = z.infer<typeof formSchema>;

// const formSchema = z.object({
//    email: z.string().email(),
// });

// interface OAuthProvider {
//    type: "github" | "google" | "twitter";
// }

// export function CreateAccountComponent({
//    title,
//    type,
// }: {
//    title: string;
//    type: string;
// }) {
//    const [isSubmitting, setIsSubmitting] = useState(false);

//    const router = useRouter();

//    const handleMagicLink = async (data: SignupFormValues) => {
//       if (isSubmitting) {
//          return;
//       }
//       setIsSubmitting(true);
//       const { email } = data;
//       try {
//          const { data, error } = await supabase.auth.signInWithOtp({
//             email,
//          });

//          if (error) {
//             console.error("Error signing up", error.message);
//             toast.error("Error signing up !");
//          } else {
//             toast.success("Signed up successfully !");
//             router.push("/");
//          }
//       } catch (error: any) {
//          console.error("Error signing up:", error.message);
//          toast.error("Error signing up !");
//          // Handle unexpected errors here
//       } finally {
//          setTimeout(() => {
//             setIsSubmitting(false);
//          }, 6000);
//       }
//    };

//    const handleSignUpWithProvider = async (provider: OAuthProvider) => {
//       try {
//          const { data: user, error } = await supabase.auth.signInWithOAuth({
//             provider: provider.type,
//          });

//          if (user) {
//             router.push("/");
//             toast.success("Sign up Success !!!");
//          } else if (error) {
//             console.log(error.message);
//          }
//       } catch (error: any) {
//          console.log("Error:", error.message);
//          toast.error("Error signing up:", error.message);
//       } finally {
//          setTimeout(() => {
//             setIsSubmitting(false);
//          }, 6000);
//       }
//    };

//    const form = useForm<SignupFormValues>({
//       resolver: zodResolver(formSchema),
//    });
//    return (
//       <Card className="w-[350px]  md:w-auto ">
//          <CardHeader className="space-y-1">
//             <CardTitle className="pb-10 text-2xl text-center">
//                {title}
//             </CardTitle>
//             <CardDescription className="text-center">
//                Select a sign in option to {type}
//             </CardDescription>
//          </CardHeader>
//          <CardContent className="grid gap-4">
//             <div className="flex flex-col items-center justify-center gap-4 w-[300px] md:w-full ">
//                <Button
//                   variant="outline"
//                   disabled={isSubmitting}
//                   onClick={() => handleSignUpWithProvider({ type: "github" })}>
//                   <AiOutlineGithub className="w-4 h-4 mr-2 dark:text-white" />
//                   Sign in with Github
//                </Button>
//                <Button
//                   variant="outline"
//                   disabled={isSubmitting}
//                   onClick={() => handleSignUpWithProvider({ type: "google" })}>
//                   <PiGoogleLogo className="w-4 h-4 mr-2 dark:text-white" />
//                   Sign in with Google
//                </Button>
//                <Button
//                   variant="outline"
//                   disabled={isSubmitting}
//                   onClick={() => handleSignUpWithProvider({ type: "twitter" })}>
//                   <PiTwitterLogo className="w-4 h-4 mr-2 dark:text-white" />
//                   Sign in with Twitter
//                </Button>
//                <Button
//                   variant="outline"
//                   disabled={isSubmitting}
//                   // onClick={handleMagicLink}>
//                >
//                   <AiOutlineMail className="w-4 h-4 mr-2 dark:text-white" />
//                   Sign in with Email
//                </Button>
//             </div>
//          </CardContent>
//          <CardFooter className="pt-8">
//             <CardContent>
//                <p className="text-xs text-center">
//                   No account?
//                   <span className="font-bold text-eccentric">
//                      <Link href="/signup"> Create one</Link>
//                   </span>
//                </p>

//                <p className="pt-10 text-xs text-center">
//                   Forgot email or trouble signing in? Get help.
//                </p>
//             </CardContent>
//          </CardFooter>
//       </Card>
//    );
// }
