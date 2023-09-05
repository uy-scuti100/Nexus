// "use client";

// import { Button } from "@/components/ui/button";
// import { AiOutlineGithub } from "react-icons/ai";
// import { PiGoogleLogo, PiTwitterLogo } from "react-icons/pi";
// import {
//    Card,
//    CardContent,
//    CardDescription,
//    CardFooter,
//    CardHeader,
//    CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import supabase from "@/app/api/supabaseClient";
// import { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
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
// import {
//    signInWithEmailPasswordSuccess,
//    signInWithEmailPasswordFailed,
// } from "../../state/authSlice";
// import { useDispatch } from "react-redux";
// import Link from "next/link";

// type SignupFormValues = z.infer<typeof formSchema>;

// const formSchema = z.object({
//    email: z.string().email(),
// });

// export function LoginComponent() {
//    const [isSubmitting, setIsSubmitting] = useState(false);
//    const dispatch = useDispatch();

//    const router = useRouter();

//    const handleLogin = async (data: SignupFormValues) => {
//       if (isSubmitting) {
//          return;
//       }

//       setIsSubmitting(true);
//       const { email } = data;

//       try {
//          const { data: user, error } = await supabase.auth.signInWithOtp({
//             email,
//          });

//          if (user) {
//             console.log(user);
//             toast.success("Logged in successfully!");
//             router.push("/");
//          } else if (error) {
//             console.error("Error logging in", error.message);
//             toast.error("Error logging in!");
//          }
//       } catch (error) {
//          console.error("Error signing in:", error);
//          toast.error("Error signing in!");
//       } finally {
//          setTimeout(() => {
//             setIsSubmitting(false);
//          }, 6000);
//       }
//    };

//    //   finally {
//    //          // toast.success("Signed up successfully !");
//    //          setTimeout(() => {
//    //             setIsSubmitting(false);
//    //          }, 6000);
//    //       }
//    //    };

//    const form = useForm<SignupFormValues>({
//       resolver: zodResolver(formSchema),
//    });
//    return (
//       <Card className="w-[350px]  md:w-auto ">
//          <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl text-center pb-8">
//                Welcome back.
//             </CardTitle>
//             <CardDescription className="text-center">
//                Select a sign in option to login
//             </CardDescription>
//          </CardHeader>
//          <CardContent className="grid gap-4">
//             <Form {...form}>
//                <form
//                   className="grid gap-4 w-[350px] md:w-auto "
//                   onSubmit={form.handleSubmit(handleLogin)}>
//                   <FormField
//                      control={form.control}
//                      name="email"
//                      render={({ field }) => (
//                         <FormItem className="grid gap-2">
//                            <FormLabel>Email</FormLabel>
//                            <FormControl>
//                               <Input
//                                  disabled={isSubmitting}
//                                  placeholder="abc@gmail.com"
//                                  {...field}
//                                  className="w-[300px] md:w-full "
//                               />
//                            </FormControl>
//                            <FormMessage />
//                         </FormItem>
//                      )}
//                   />
//                   <Button
//                      variant="default"
//                      className="w-[300px] md:w-full"
//                      type="submit"
//                      disabled={isSubmitting}>
//                      {isSubmitting ? "Logging in" : "Log In"}
//                   </Button>
//                </form>
//             </Form>
//          </CardContent>
//          <CardFooter>
//             <CardContent>
//                <p className="text-center">
//                   No account?
//                   <span className="text-eccentric underline">
//                      <Link href="/signup"> Create one</Link>
//                   </span>
//                </p>
//             </CardContent>
//          </CardFooter>
//       </Card>
//    );
// }
