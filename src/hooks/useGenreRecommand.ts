import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

export interface GenreRecommandParams {
  genres: string[];
  gender: string; // 'man' | 'woman'
}

export interface GenreRecommandItem {
  TITLE?: string;
  title?: string;
  poster?: string;
  overview?: string;
  rating?: number;
  [key: string]: unknown;
}

export function useGenreRecommand() {
  const [result, setResult] = useState<GenreRecommandItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchGenreRecommand = async (params: GenreRecommandParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post("/api/genre-recommends", params);
      setResult(res.data?.results || res.data || []);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e);
      else setError(new Error("알 수 없는 에러"));
      setResult([]);
    } finally {
      setLoading(false);
    }
  };

  return { result, loading, error, fetchGenreRecommand };
}
