"use client";
import React, { useEffect, useState } from "react";
import { logout } from "../logout/actions";
import MovieCard from "../components/movie-card";
import Link from "next/link";

export default function DashboardPage() {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!input) return setSearchResults([]);

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${
            process.env.NEXT_PUBLIC_API_KEY
          }&query=${encodeURIComponent(input)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        setSearchResults(data.results);
      } catch (err) {
        console.error("Error searching movies:", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [input]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <Link href="/dashboard">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </Link>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            className="pl-10 pr-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Search..."
          />
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Log out
          </button>
        </form>
      </header>

      <main className="container mx-auto py-8">
        {isSearching ? (
          <div className="text-center">Loading...</div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {searchResults.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <MovieCard />
        )}
      </main>

      <footer className="bg-white shadow-inner py-4 px-6 mt-8 text-center">
        <p>© 2024 Movie Shorts</p>
      </footer>
    </div>
  );
}
