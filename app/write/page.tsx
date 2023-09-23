"use client";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import ReactQuill from "react-quill";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import hljs from "highlight.js";

import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Camera, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
interface Category {
   id: string;
   created_at: Date;
   name: string;
}

type NoteFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
   title: z.string().min(1),
   snippet: z.string().min(1),
   category_id: z.string(),
   content: z.string().min(1),
   image: z.object({ url: z.string() }),
});

const PostForm = () => {
   const [loading, setLoading] = useState(false);
   const [cats, setCats] = useState<Category[] | null>([]);
   const [postImage, setPostImage] = useState<string | File | null>(null);
   const imageInputRef = useRef<HTMLInputElement | null>(null);

   const router = useRouter();

   hljs.configure({
      // optionally configure hljs
      languages: [
         "javascript",
         "python",
         "c",
         "c++",
         "java",
         "HTML",
         "css",
         "matlab",
         "typescript",
      ],
   });

   const modules = {
      toolbar: [
         [
            { header: "1" },
            { header: "2" },
            { font: [] },
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            "code-block",
            "clean",
            "blockquote",
            "strike",
            "align",
            "underline",
            "italic",
            "bold",
            "color",
            "link",
            "image",
            "video",
            "background",
         ],
      ],
   };

   const formats = [
      "header",
      "font",
      "size",
      "bold",
      "italic",
      "underline",
      "align",
      "strike",
      "script",
      "blockquote",
      "background",
      "list",
      "bullet",
      "indent",
      "link",
      "image",
      "color",
      "code-block",
      "video",
   ];
   const form = useForm<NoteFormValues>({
      resolver: zodResolver(formSchema),
   });

   useEffect(() => {
      const fetchCategories = async () => {
         let { data: categories, error } = await supabase
            .from("categories")
            .select("*");

         if (error) {
            console.log("there was an error fetching data", error.message);
         }
         setCats(categories);
      };
      fetchCategories();
   }, []);

   const handleCreateNote = async (data: NoteFormValues) => {
      try {
         setLoading(true);

         const { error } = await supabase
            .from("notes")
            .insert([
               {
                  title: data.title,
                  category_id: data.category_id,
                  snippet: data.snippet,
                  content: data.content,
                  image: data.image,
               },
            ])
            .select();

         if (error) {
            toast.error("Something went wrong.");
            console.error("Error creating note:", error.message);
         } else {
            toast.success("Note created successfully");
            router.push("/");
         }
      } catch (error: any) {
         console.error("An error occurred:", error.message);
      } finally {
         setLoading(false);
      }
   };

   const uploadPostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      const imageFile = e.target.files?.[0]; // Safely access the selected file

      if (imageFile) {
         setPostImage(imageFile);
      }
   };

   return (
      <>
         <div className=" max-w-[1104px] px-6 mx-auto py-6  mt-6 pt-24">
            <div className="flex items-center justify-end">
               <Button
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                  onClick={() => {}}>
                  <Trash2 />
               </Button>
            </div>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleCreateNote)}
                  className="w-full pb-20 space-y-8">
                  <div className="grid gap-8">
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                 <Input
                                    disabled={loading}
                                    placeholder="Title"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <div className="py-4 text-3xl text-center">
                        Add an Image
                     </div>
                     <form>
                        <label
                           htmlFor="postImg"
                           className="flex items-center justify-center cursor-pointer">
                           <Camera className="w-10 h-10" />
                        </label>
                        <input
                           id="postImg"
                           type="file"
                           accept="image/*"
                           onChange={uploadPostImage}
                           ref={imageInputRef}
                           style={{ display: "none" }}
                        />
                        {postImage instanceof File && (
                           <img
                              src={URL.createObjectURL(postImage)}
                              alt="Preview"
                              style={{
                                 objectFit: "cover",
                                 width: "100%",
                                 height: "400px",
                              }}
                           />
                        )}
                     </form>
                     <FormField
                        control={form.control}
                        name="snippet"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Snippet</FormLabel>
                              <FormControl>
                                 <Textarea
                                    disabled={loading}
                                    placeholder="Snippet"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl>
                                 <div>
                                    <>
                                       <ReactQuill
                                          modules={modules}
                                          theme="snow"
                                          formats={formats}
                                          style={{ height: 300 }}
                                          {...field}
                                          placeholder="write your note"
                                          // className="text-black bg-gray-100 dark:bg-gray-900 dark:text-white placeholder:dark:text-white"
                                       />
                                    </>
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     <Button disabled={loading} className="mt-20" type="submit">
                        {loading ? "Posting..." : "Post"}
                     </Button>
                  </div>
               </form>
            </Form>
         </div>
      </>
   );
};

export default PostForm;
