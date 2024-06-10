"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";

export default function MovieDetails() {
  const router = useRouter();
  const params = useParams();
  const movieId = params.title;
  const [movieDetails, setMovieDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(() => {
    const storedReviews = localStorage.getItem("movieReviews");
    return storedReviews ? JSON.parse(storedReviews) : {};
  });
  const [editingIndex, setEditingIndex] = useState(-1);

  const handleSubmitReview = () => {
    if (reviewText.trim() !== "") {
      const newReviews = {
        ...reviews,
        [movieId]: [{ text: reviewText }, ...(reviews[movieId] || [])],
      };
      setReviews(newReviews);
      localStorage.setItem("movieReviews", JSON.stringify(newReviews));
      setReviewText("");
    }
  };

  const handleDeleteReview = (index) => {
    const updatedReviews = { ...reviews };
    updatedReviews[movieId].splice(index, 1);
    setReviews(updatedReviews);
    localStorage.setItem("movieReviews", JSON.stringify(updatedReviews));
  };

  const handleEditReview = (index) => {
    setReviewText(reviews[movieId][index].text);
    setEditingIndex(index);
  };

  const handleSaveEdit = () => {
    if (reviewText.trim() !== "") {
      const updatedReviews = { ...reviews };
      updatedReviews[movieId][editingIndex].text = reviewText;
      setReviews(updatedReviews);
      localStorage.setItem("movieReviews", JSON.stringify(updatedReviews));
      setReviewText("");
      setEditingIndex(-1);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      try {
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.NEXT_PUBLIC_API_KEY}`
        );

        if (!detailsResponse.ok || !creditsResponse.ok) {
          throw new Error("Failed to fetch movie details or credits.");
        }

        const detailsData = await detailsResponse.json();
        const creditsData = await creditsResponse.json();

        setMovieDetails({ ...detailsData, ...creditsData });
      } catch (err) {
        console.error("Error fetching movie details or credits:", err);
        setError("Failed to fetch movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  const imageUrl = movieDetails.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
    : "/placeholder-image.jpg";

  return (
    <div className="container mx-auto px-4 lg:px-0 py-8">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-4 flex items-center"
      >
        <ChevronLeftIcon className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Button>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-1/3">
          <img
            src={imageUrl}
            alt={movieDetails?.title}
            className="w-full h-auto"
          />
        </div>

        {/* Movie Details, Cast, and Crew */}
        <div className="p-6 lg:w-2/3">
          <h2 className="text-3xl font-bold mb-4">{movieDetails?.title}</h2>
          <p className="text-gray-700 mb-6">{movieDetails?.overview}</p>

          <h3 className="text-xl font-semibold mb-2 mt-4">Cast</h3>
          <div className="flex flex-wrap gap-4">
            {movieDetails?.cast?.slice(0, 6).map((actor) => (
              <div key={actor.id} className="flex flex-col items-center mb-4">
                {actor.profile_path && (
                  <>
                    <img
                      src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                      alt={actor.name}
                      className="w-18 h-18 rounded-lg object-cover mb-2"
                    />
                    <p className="text-sm text-center">
                      {actor.name.split(" ")[0]} {actor.name.split(" ")[1]}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-2">Crew</h3>
          <div className="flex flex-wrap gap-4">
            {movieDetails?.crew?.map((crewMember) => {
              if (crewMember.job.toLowerCase() === "director") {
                return (
                  <div
                    key={crewMember.id}
                    className="flex flex-col items-center"
                  >
                    {crewMember.profile_path && (
                      <>
                        <img
                          src={`https://image.tmdb.org/t/p/w92${crewMember.profile_path}`}
                          alt={crewMember.name}
                          className="w-16 h-16 rounded-lg object-cover mb-2"
                        />
                        <p className="text-sm text-center">{crewMember.name}</p>
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
      {/* Review Section with Adjusted Width */}
      <div className="mt-8 max-w-7xl mx-auto">
        <h3 className="text-xl font-semibold mb-2">Reviews</h3>

        {/* Review form */}
        <div className="flex flex-col space-y-2">
          {" "}
          {/* Stack Textarea and Button */}
          <Textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="flex-1"
          />
          <div className="self-end">
            {" "}
            {/* Align button to the right */}
            {editingIndex !== -1 ? (
              <Button onClick={handleSaveEdit}>Save Edit</Button>
            ) : (
              <Button onClick={handleSubmitReview} className="w-fit px-4">
                Submit Review
              </Button>
            )}
          </div>
        </div>
        {/* Review list */}
        <div className="mt-4 space-y-4">
          {reviews[movieId] &&
            reviews[movieId].map((review, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                {editingIndex === index ? (
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="flex-1 mb-2 sm:mb-0 sm:mr-4"
                  />
                ) : (
                  <p className="mb-2 sm:mb-0">{review.text}</p>
                )}
                <div className="flex space-x-2">
                  {editingIndex === index ? (
                    <Button onClick={handleSaveEdit}>Save</Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => handleEditReview(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteReview(index)}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
