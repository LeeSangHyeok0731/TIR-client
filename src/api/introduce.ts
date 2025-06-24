import { fetchMoviePoster } from "./tmdb";
import axiosInstance from "@/utils/axiosInstance";

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
  const response = await axiosInstance.get("/api/introduce", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const movies: MoviePreference[] = response.data;

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
