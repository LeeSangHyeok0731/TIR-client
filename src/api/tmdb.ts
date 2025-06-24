interface TMDBResponse {
  results: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
    vote_count: number;
  }>;
  total_results: number;
  total_pages: number;
}

export interface MovieInfo {
  id: number;
  title: string;
  poster: string;
  releaseDate: string;
  rating: number;
  voteCount: number;
  overview: string;
}

export const fetchMovieInfo = async (
  title: string
): Promise<MovieInfo | null> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
      console.error("TMDB API key is not set");
      return null;
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        title
      )}&language=ko-KR&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie info");
    }

    const data: TMDBResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      return {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        overview: movie.overview || "설명이 없습니다.",
      };
    }

    return null; // 영화를 찾을 수 없는 경우
  } catch (error) {
    console.error("Error fetching movie info:", error);
    return null; // 에러 시 null 반환
  }
};

export const fetchMoviePoster = async (title: string): Promise<string> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
      console.error("TMDB API key is not set");
      return "";
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        title
      )}&language=ko-KR&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie poster");
    }

    const data: TMDBResponse = await response.json();

    if (data.results && data.results.length > 0) {
      const posterPath = data.results[0].poster_path;
      return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : "";
    }

    return ""; // 포스터를 찾을 수 없는 경우
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return ""; // 에러 시 빈 문자열 반환
  }
};

export const fetchPopularMovies = async (): Promise<MovieInfo[]> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
      console.error("TMDB API key is not set");
      return [];
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=ko-KR&api_key=${apiKey}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    const data: TMDBResponse = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "",
        releaseDate: movie.release_date,
        rating: movie.vote_average,
        voteCount: movie.vote_count,
        overview: movie.overview || "설명이 없습니다.",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

export const submitRating = async (
  movieId: string,
  movieTitle: string,
  rating: number
) => {
  try {
    const response = await fetch("/api/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT 토큰
      },
      body: JSON.stringify({
        movieId,
        movieTitle,
        rating,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "평점 등록에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("평점 등록 에러:", error);
    throw error;
  }
};
