import { NextResponse } from "next/server";
import supabase from "../../../lib/supabaseClient";

const fetchUser = async (req: Request, res: NextResponse) => {
   if (req.method === "GET")
      try {
         const {
            data: { user },
         } = await supabase.auth.getUser();

         // Wrap the user data in an object
         const userData = { user };

         return NextResponse.json(userData);
      } catch (error) {
         console.error("Error fetching user:", error);
         return new NextResponse("Internal error", { status: 500 });
      }
};

export default fetchUser;
