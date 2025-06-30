import { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

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
        const response = await axiosInstance.get("/api/ratings");
        setData(response.data);
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
