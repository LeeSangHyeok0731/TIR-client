import { useState, useEffect } from "react";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

interface Rating {
  ID: number;
  USER_EMAIL: string;
  MOVIE_TITLE: string;
  RATING: number;
  CREATED_AT: string;
  UPDATED_AT: string;
}

export const useRatings = () => {
  const [data, setData] = useState<Rating[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        const response = await fetchWithAuth("/ratings");

        if (!response.ok) {
          throw new Error("평점 데이터를 가져오는데 실패했습니다.");
        }

        const ratingsData = await response.json();
        setData(ratingsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("알 수 없는 오류가 발생했습니다.")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return { data, isLoading, error };
};
