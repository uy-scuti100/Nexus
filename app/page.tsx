import { CreateAccountComponent } from "@/components/myComponents/CreateAccountComponent";

export default function Home() {
   return (
      <main>
         <div className="flex justify-center w-full h-screen">
            <div className="h-screen w-[350px] flex justify-center items-center ">
               <CreateAccountComponent />
            </div>
         </div>
      </main>
   );
}
