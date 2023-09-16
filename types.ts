// user.ts
export interface User {
   id: string | null | undefined;
   email: string | null | undefined;
   avatarUrl?: string | null | undefined;
   fullName?: string | null | undefined;
   bio?: string | null | undefined;
   display_name?: string | null | undefined;
   isVerified?: boolean;
   display_pic?: string | null | undefined;
}

export interface Category {
   id: string | null;
   name: string | null;
}
export interface Hashtag {
   id: string | null;
   name: string | null;
}

export interface Post {
   id: string;
   title: string;
   profile_id: string;
   category_id: string;
   category_name: string;
   content: string;
   image: string;
   snippet: string;
   created_at: Date;
   updated_at: Date;
   author_verification: boolean;
   author: string;
   author_image: string;
}
