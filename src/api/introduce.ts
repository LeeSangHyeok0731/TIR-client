import { fetchMoviePoster } from "./tmdb";

export interface MoviePreference {
  TITLE: string;
  RATING: number;
  MANRATING: number;
  FEMALERATING: number;
  MANPER: number;
  FEMALEPER: number;
  MANGR: number;
  WOMANGR: number;
  PREFER: "man" | "woman";
  poster?: string;
}

export const fetchIntroduce = async (): Promise<MoviePreference[]> => {
  const response = await fetch("/api/introduce", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch introduce data");
  }

  const movies: MoviePreference[] = await response.json();

  const moviesWithPosters = await Promise.all(
    movies.map(async (movie) => {
      try {
        const poster = await fetchMoviePoster(movie.TITLE);
        return {
          ...movie,
          poster,
        };
      } catch (error) {
        console.error(`Error fetching poster for ${movie.TITLE}:`, error);
        return {
          ...movie,
          poster: "",
        };
      }
    })
  );

  return moviesWithPosters;
};
