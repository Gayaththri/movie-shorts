import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
}

interface MovieCardProps {
  movie?: Movie; // Allow for a single movie or multiple
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        // Fetch only if 'movie' prop isn't provided (multiple movie mode)
        if (!movie) {
          const apiKey = process.env.NEXT_PUBLIC_API_KEY;
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
          );

          if (!response.ok) {
            throw new Error("Network response was not ok.");
          }

          const data = await response.json();
          setMovies(data.results);
        }
      } catch (err) {
        setError("Failed to fetch movies. Please try again later.");
        console.error("Error fetching movies:", err);
      }
    }

    fetchMovies(); // Call the function here
  }, [movie]); // Only re-fetch if 'movie' prop changes

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const moviesToDisplay = movie ? [movie] : movies;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {moviesToDisplay.map((movie) => (
        <Link
          key={movie.id}
          href={`/movies/${movie.id}`} // Use template literal for dynamic route
          className="no-underline"
        >
          <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:scale-105 transition-transform duration-200 h-full">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-48 object-cover object-center"
                loading="lazy" // Improve loading performance
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 animate-pulse"></div> // Placeholder with animation
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
              <p className="text-gray-600 line-clamp-3">{movie.overview}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
