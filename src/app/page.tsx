"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto py-24 flex flex-col items-center justify-center h-screen">
      <div className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to Movie Shorts
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Discover, discuss, and enjoy the world of movies in a nutshell.
        </p>
        <div>
          <Link href="/login">
            <button
              className={cn(
                "rounded-md bg-gradient-to-r from-indigo-500 to-cyan-500",
                "py-2 px-4 text-sm md:text-base font-semibold text-white shadow-sm",
                "hover:from-indigo-600 hover:to-cyan-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              )}
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
