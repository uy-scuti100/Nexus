"use client";

import * as React from "react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { MdMonitor } from "react-icons/md";
export function ModeToggle() {
   const { setTheme } = useTheme();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
               <BsFillSunFill className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-colors dark:-rotate-90 dark:scale-0" />
               <BsFillMoonFill className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-colors dark:rotate-0 dark:scale-100" />
               <span className="sr-only">Toggle theme</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => setTheme("light")}>
               <BsFillSunFill />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
               <BsFillMoonFill />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
               <MdMonitor />
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
