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
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { Camera, ChevronLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/atom-one-dark.css";
// import { categorizePost } from "@/lib/categorizePost";
import { useFetchUser } from "@/hooks/useFetchUser";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface Category {
   id: string;
   created_at: Date;
   name: string;
}

type NoteFormValues = z.infer<typeof formSchema>;
const formSchema = z.object({
   title: z.string().min(1),
   snippet: z.string().min(1),
   content: z.string().min(1),
   image: z.string(), // Update this line to expect a string directly
   category_id: z.string(),
});

const PostForm = () => {
   const postImageUrl = process.env.NEXT_PUBLIC_SUPABASE_IMAGE_URL;
   const [loading, setLoading] = useState(false);
   const [cats, setCats] = useState<Category[] | null>([]);
   const [postImage, setPostImage] = useState<string | File | null>(null);
   const imageInputRef = useRef<HTMLInputElement | null>(null);
   const { user } = useFetchUser();
   const userId = user?.id;
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
            console.log("There was an error fetching data", error.message);
         }
         setCats(categories);
      };
      fetchCategories();
   }, []);

   const handleCreatePost = async (data: NoteFormValues) => {
      let imageUrl = "";
      try {
         setLoading(true);

         if (postImage instanceof File) {
            // Generate a random 10-digit number
            const randomSuffix = Math.floor(
               1000000000 + Math.random() * 9000000000
            ).toString();

            // Append the random number to the image name
            const imageName = `${randomSuffix}-${postImage.name}`;

            const { data: imageUploadResponse, error: imageUploadError } =
               await supabase.storage
                  .from("post_images")
                  .upload(imageName, postImage, {
                     cacheControl: "3600",
                     upsert: true,
                  });

            if (imageUploadResponse) {
               // Get the URL of the uploaded image
               imageUrl = imageUploadResponse.path;
               // console.log(imageUrl);
               // toast.success("upload success");
            } else {
               console.error(
                  "Error uploading image:",
                  imageUploadError?.message
               );
               toast.error("Failed to upload image");
               return;
            }
         }
         // Get the list of category names
         const categories = cats
            ? cats.map((category: Category) => category.name)
            : [];

         // Categorize the post based on its content
         // const selectedCategory = categorizePost(data, categories);

         // console.log("Selected Category:", selectedCategory);

         // Insert the post into the database
         const { data: post, error } = await supabase
            .from("posts")
            .insert([
               {
                  title: data.title,
                  profile_id: userId,
                  // category_id: selectedCategory,
                  category_id: data.category_id,
                  snippet: data.snippet,
                  content: data.content,
                  image: `${postImageUrl}${imageUrl}`,
               },
            ])
            .select();

         if (post) {
            router.push("/home");
            toast.success("Post Created");
            // console.log("Post:", post);
         } else {
            toast.error("Failed to create Post");
            // console.log(error.message);
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

   const handleBack = () => {
      window.history.back();
   };

   return (
      <>
         <div className=" max-w-[1104px] px-6 mx-auto py-6 mt-6">
            <div className="flex items-center justify-end">
               <Button
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  onClick={handleBack}>
                  <ChevronLeft />
               </Button>
            </div>

            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(handleCreatePost)}
                  className="w-full pb-20 space-y-8">
                  <div className="grid gap-8">
                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel> Select a cover Image</FormLabel>
                              <FormControl>
                                 <div>
                                    <label
                                       htmlFor="postImg"
                                       className="flex items-center justify-center cursor-pointer">
                                       <Camera className="w-10 h-10 mb-10" />
                                    </label>
                                    <input
                                       id="postImg"
                                       name="image"
                                       type="file"
                                       accept="image/*"
                                       onChange={(e) => {
                                          uploadPostImage(e);
                                          field.onChange(e.target.value);
                                       }}
                                       value={field.value || ""}
                                       disabled={loading}
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
                                 </div>
                              </FormControl>
                           </FormItem>
                        )}
                     />
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
                     <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select
                                 disabled={loading}
                                 onValueChange={field.onChange}
                                 value={field.value}
                                 defaultValue={field.value}>
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue
                                          defaultValue={field.value}
                                          placeholder="Select a category"
                                       />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    {cats?.map((category) => (
                                       <SelectItem
                                          key={category.id}
                                          value={category.id}>
                                          {category.name}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
                                    className="h-20 resize-none"
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
