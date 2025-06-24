interface IMDBResponse {
  Search: Array<{
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
  }>;
  totalResults: string;
  Response: string;
}

export const fetchMoviePoster = async (title: string): Promise<string> => {
  try {
    const response = await fetch(
      `http://www.omdbapi.com/?s=${encodeURIComponent(
        title
      )}&apikey=YOUR_API_KEY`,
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

    const data: IMDBResponse = await response.json();

    if (data.Response === "True" && data.Search && data.Search.length > 0) {
      return data.Search[0].Poster;
    }

    return ""; // 포스터를 찾을 수 없는 경우
  } catch (error) {
    console.error("Error fetching movie poster:", error);
    return ""; // 에러 시 빈 문자열 반환
  }
};
