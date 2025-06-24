interface TMDBResponse {
  results: Array<{
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
  }>;
  total_results: number;
  total_pages: number;
}

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
