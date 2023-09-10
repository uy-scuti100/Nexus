// user.ts
export interface User {
   email: string | null | undefined;
   id: string | null | undefined;
   avatarUrl: string | null | undefined;
   fullName: string | null | undefined;
}

export interface Category {
   id: string | null;
   name: string | null;
}
export interface Hashtag {
   id: string | null;
   name: string | null;
}
